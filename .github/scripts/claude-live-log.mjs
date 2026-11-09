// Reads `claude -p --output-format stream-json --verbose` from stdin and prints
// one readable line per step, so the Actions log shows live what Claude does.
// At the end it writes a step summary and the verdict to $GITHUB_OUTPUT.
import { appendFileSync } from 'node:fs'
import { createInterface } from 'node:readline'

const steps = []
let result

const short = (text, max = 160) => {
  const line = String(text ?? '').replace(/\s+/g, ' ').trim()
  return line.length > max ? `${line.slice(0, max - 1)}…` : line
}

function describeTool(name, input = {}) {
  switch (name) {
    case 'Bash': return ['🔧', short(input.command)]
    case 'Read': return ['📖', `Lese ${input.file_path}`]
    case 'Write': return ['📝', `Schreibe ${input.file_path}`]
    case 'Skill': return ['🧩', `Lade Skill ${input.skill}`]
    case 'StructuredOutput': return ['⚖️', `passed: ${input.passed} · Urteil: ${input.verdict} · ${short(input.summary, 140)}`]
    default: return ['🛠️', `${name} ${short(JSON.stringify(input), 120)}`]
  }
}

function log(icon, text) {
  steps.push({ icon, text })
  console.log(`${String(steps.length).padStart(3)} ${icon} ${text}`)
}

for await (const line of createInterface({ input: process.stdin })) {
  let event
  try {
    event = JSON.parse(line)
  }
  catch {
    continue
  }

  if (event.type === 'assistant') {
    for (const part of event.message?.content ?? []) {
      if (part.type === 'text' && part.text.trim())
        log('💬', short(part.text, 200))
      if (part.type === 'tool_use')
        log(...describeTool(part.name, part.input))
    }
  }

  if (event.type === 'user') {
    for (const part of event.message?.content ?? []) {
      if (part.type === 'tool_result' && part.is_error)
        log('⚠️', `Fehler: ${short(typeof part.content === 'string' ? part.content : JSON.stringify(part.content), 160)}`)
    }
  }

  if (event.type === 'result')
    result = event
}

const verdict = result?.structured_output?.verdict ?? ''
const passed = result?.structured_output?.passed === true
const cost = result?.total_cost_usd?.toFixed(2) ?? '?'
const minutes = result?.duration_ms ? (result.duration_ms / 60000).toFixed(1) : '?'

console.log(`\n=== ${result?.subtype ?? 'kein Ergebnis'} · passed: ${passed} · Urteil: ${verdict || 'keins'} · ${result?.num_turns ?? '?'} Turns · ${cost} $ · ${minutes} Min ===`)

if (process.env.GITHUB_OUTPUT)
  appendFileSync(process.env.GITHUB_OUTPUT, `verdict=${verdict}\npassed=${passed}\n`)

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = steps.map((s, i) => `| ${i + 1} | ${s.icon} | ${s.text.replaceAll('|', '\\|')} |`).join('\n')
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, [
    `## Claude QA: ${passed ? '✅ passed' : '❌ nicht passed'} · ${verdict || 'kein Urteil'}`,
    '',
    `${result?.num_turns ?? '?'} Turns · ${cost} $ · ${minutes} Min · Ende: \`${result?.subtype ?? 'unbekannt'}\``,
    '',
    '<details><summary>Alle Schritte</summary>',
    '',
    '| # | | Schritt |',
    '|---|---|---|',
    rows,
    '',
    '</details>',
    '',
  ].join('\n'))
}

if (!result || result.subtype !== 'success')
  process.exit(1)

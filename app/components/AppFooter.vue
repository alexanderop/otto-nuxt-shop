<script setup lang="ts">
const usps = [
  { icon: 'b2b_icon-delivery-express', title: 'Schnelle Lieferung', text: 'Viele Artikel in 1–2 Werktagen' },
  { icon: 'b2b_icon-order-return', title: '30 Tage Rückgabe', text: 'Kostenlos & unkompliziert' },
  { icon: 'b2b_icon-lock-closed-check', title: 'Sicher bezahlen', text: 'Rechnung, Raten, PayPal' },
  { icon: 'b2b_icon-person-callcenter', title: 'Kundenservice', text: '7 Tage die Woche für dich da' },
]

const columns = [
  { title: 'Hilfe & Kontakt', links: ['Kundenservice', 'Bestellstatus', 'Rücksendung', 'Zahlung'] },
  { title: 'Über uns', links: ['Unternehmen', 'Karriere', 'Nachhaltigkeit', 'Presse'] },
  { title: 'Services', links: ['App', 'Newsletter', 'Gutscheine', 'Marktplatz'] },
]
</script>

<template>
  <footer class="footer">
    <div class="usps">
      <ul class="container usps__list">
        <li v-for="usp in usps" :key="usp.title" class="usp">
          <b2b-icon-100 :icon="usp.icon" :size="32" />
          <div>
            <strong>{{ usp.title }}</strong>
            <p>{{ usp.text }}</p>
          </div>
        </li>
      </ul>
    </div>

    <div class="container footer__cols">
      <div v-for="col in columns" :key="col.title">
        <h3>{{ col.title }}</h3>
        <ul>
          <li v-for="link in col.links" :key="link">
            <a href="#">{{ link }}</a>
          </li>
        </ul>
      </div>
      <div>
        <h3>Newsletter</h3>
        <p class="footer__note">Demo-Shop für einen Talk. Kein echter Shop.</p>
      </div>
    </div>

    <div class="footer__legal">
      <div class="container">
        Demo · Nuxt + OTTO B2B Design System · Produktdaten von dummyjson.com
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  margin-top: 64px;
  background: var(--otto-bg);
  font-size: 14px;
}

.usps {
  border-bottom: 1px solid var(--otto-line);
  background: #fff;
}

.usps__list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  list-style: none;
  margin-block: 0;
  padding-block: 24px;
}

.usp {
  display: flex;
  gap: 12px;
  align-items: center;
}

.usp p {
  margin: 0;
  color: var(--otto-muted);
}

.footer__cols {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  padding-block: 32px;
}

.footer__cols h3 {
  font-size: 16px;
  margin: 0 0 12px;
}

.footer__cols ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}

.footer__cols a:hover {
  text-decoration: underline;
}

.footer__note {
  color: var(--otto-muted);
  margin: 0;
}

.footer__legal {
  background: var(--otto-ink);
  color: #fff;
  font-size: 12px;
  padding-block: 16px;
}
</style>

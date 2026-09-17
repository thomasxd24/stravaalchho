import { PageHeader } from '../components/PageHeader'
import { countryByCode } from '../data/countries'
import { useStore } from '../state/store'

export function Safety() {
  const { data } = useStore()
  const country = countryByCode(data.profile.country)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <PageHeader title="Sécurité & repères" subtitle="Achcool est fait pour suivre, pas pour pousser à boire plus" />

      <div className="space-y-5 text-sm text-stone-300">
        <Section title="Ce que l’estimation ne fait pas">
          <p>
            Le taux affiché dans l’appli est une estimation basée sur la formule de Widmark (poids, sexe
            physiologique, quantité et durée). Ce n’est ni un éthylotest, ni un avis médical, ni une preuve
            légale. Il ne prend pas en compte ta tolérance, ton état de santé, ce que tu as mangé, ni les
            médicaments éventuels.
          </p>
        </Section>

        <Section title="Ne conduis jamais après avoir bu">
          <p>
            {country.legalBacLimitGL === 0 ? (
              <>
                En {country.name} ({country.flag}), la tolérance est de zéro : 0 g/L. La seule règle sûre reste la
                même partout : si tu as bu, tu ne conduis pas.
              </>
            ) : (
              <>
                En {country.name} ({country.flag}), le taux légal de conduite est de {country.legalBacLimitGL} g/L
                de sang. Mais la seule règle vraiment sûre est : si tu as bu, tu ne conduis pas.
              </>
            )}{' '}
            Prévois un taxi, un proche sobre, les transports, ou dors sur place.
          </p>
        </Section>

        <Section title="Qu’est-ce qu’un verre standard ?">
          <p>
            Un verre standard ≈ 14 g d’alcool pur : une bière de 33 cl à 5°, un verre de vin de 12,5 cl à 12°, ou
            un shot de 4 cl à 40°. Alterner avec de l’eau et manger ralentit l’absorption, mais n’élimine
            pas l’alcool plus vite.
          </p>
        </Section>

        <Section title="Besoin d’aide ?">
          <ul className="list-disc space-y-1 pl-5">
            <li>France — Alcool Info Service : 0 980 980 930 (appel non surtaxé, 7j/7)</li>
            <li>France — SOS Amitié : 09 72 39 40 50</li>
            <li>International — cherche « alcohol helpline » + ton pays pour une ressource locale</li>
          </ul>
          <p className="mt-2 text-stone-500">
            Si toi ou un proche buvez d’une façon qui vous inquiète, ces lignes sont gratuites, anonymes et
            tenues par des professionnels.
          </p>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-stone-900/60 p-4">
      <h2 className="mb-2 font-semibold text-amber-400">{title}</h2>
      {children}
    </div>
  )
}

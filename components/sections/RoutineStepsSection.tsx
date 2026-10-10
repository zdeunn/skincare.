import { product } from '@/lib/product';

export function RoutineStepsSection() {
  return (
    <section aria-labelledby="routine-title" className="section-y">
      <div className="container-nb">
        <h2 id="routine-title" className="text-3xl sm:text-4xl">
         روتينكِ اليومي في 3 خطوات فقط ✨
        </h2>
        {/* A true sequence, so an ordered list with numbers is the right structure. */}
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {product.routine.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-nb-lg border-3 border-ink bg-surface p-5 shadow-nb">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-nb border-2 border-ink bg-sun font-display text-lg font-bold"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-xl">
                  <span className="sr-only">الخطوة {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function FinalCTA() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <Container>
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-6xl
            flex-col
            items-center
            rounded-[2.5rem]
            bg-accent
            px-6
            py-16
            text-center
            sm:px-12
            sm:py-20
            lg:px-20
            lg:py-24
          "
        >
          <p
            className="
              text-[clamp(0.625rem,0.8vw,0.75rem)]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-accent-foreground/60
            "
          >
            Ready when you are
          </p>

          <h2
            className="
              mx-auto
              mt-5
              max-w-[13ch]
              font-display
              text-balance
              text-[clamp(2.5rem,5.5vw,4.5rem)]
              font-medium
              leading-[0.98]
              tracking-tighter
              text-accent-foreground
            "
          >
            Build a more reliable supply chain.
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-xl
              text-balance
              text-[clamp(0.875rem,1.2vw,1rem)]
              leading-[1.6]
              text-accent-foreground/65
            "
          >
            Tell us what your business needs and let&apos;s explore a better
            way to supply it.
          </p>

          <div className="mt-8">
            <Button href="/supply" variant="primary">
             <p className="text-primary-foreground">Start your supply plan</p> 
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
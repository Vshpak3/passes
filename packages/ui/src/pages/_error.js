import { Button, Text, Wordmark } from "src/components/atoms"

const ErrorPage = ({ statusCode }) => (
  <div className="relative h-full w-full bg-gradient-to-b from-transparent to-purple-purple4 dark:to-purpleDark-purple2">
    <header className="mx-auto max-w-3xl pt-16 text-center">
      <div className="mx-auto w-fit">
        <Wordmark height={28} width={122} />
      </div>
    </header>
    <main className="mx-auto max-w-3xl pt-8 text-center">
      <Text tag="p">
        {statusCode
          ? `Hmm... an error ${statusCode} occurred on the server.`
          : "Something went wrong. Try reloading."}
      </Text>
      <Button
        onClick={() => {
          if (typeof window !== "undefined") {
            window.location.reload()
          }
        }}
        variant="link-blue"
        fontSize={16}
      >
        Retry
      </Button>
    </main>
  </div>
)

ErrorPage.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default ErrorPage

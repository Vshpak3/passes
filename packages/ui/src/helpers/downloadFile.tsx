export const downloadFile = (url: string, name: string) => {
  fetch(url, {
    method: "GET"
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      return "File downloaded successfully"
    })
    .catch(() => {
      throw new Error(`Filed to download file`)
    })
}

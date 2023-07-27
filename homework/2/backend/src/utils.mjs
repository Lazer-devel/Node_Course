export async function createProxyResponse(res) {
  const headers = Object.fromEntries(res.headers)
  const buffer = Buffer.from(await res.arrayBuffer())
  const body =
    headers['content-type'] && headers['content-type'].includes('image')
      ? `data:${headers['content-type']};base64,${buffer.toString('base64')}`
      : buffer.toString('utf8')

  return {
    status: res.status,
    headers,
    body,
  }
}

document.addEventListener('DOMContentLoaded', init)

async function init() {
  const [variants, statistic] = await Promise.all([
    (await fetch('/variants')).json(),

    new Map(
      Object.entries(
        await (
          await fetch('/stat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
          })
        ).json()
      )
    ),
  ])

  const list = document.querySelector('.candidates-list')
  list.innerText = ''
  variants.forEach((candidate) => {
    list.append(createCandidate(candidate, statistic))
  })
}

function createCandidate(candidate, statistic) {
  const container = document.createElement('div')
  container.className = 'candidate'

  const label = document.createElement('label')
  label.id = `candidate_${candidate.id}`
  label.className = 'candidate__title'
  label.innerText = `${candidate.name}: ${statistic.get(candidate.id).votes}`

  const button = document.createElement('button')
  button.className = 'candidate__vote-btn'
  button.innerText = 'Проголосовать'
  button.addEventListener('click', async () => {
    const stat = new Map(
      Object.entries(
        await (
          await fetch(`/vote`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json;charset=utf-8' },
            body: JSON.stringify({ id: candidate.id }),
          })
        ).json()
      )
    )

    Array.from(stat.keys()).forEach((id) => {
      const { name, votes } = stat.get(id)
      updateStatistic(id, `${name}: ${votes}`)
    })
  })

  container.append(label)
  container.append(button)
  return container
}

function updateStatistic(id, newValue) {
  const statLabel = document.getElementById(`candidate_${id}`)
  statLabel.innerText = newValue
}

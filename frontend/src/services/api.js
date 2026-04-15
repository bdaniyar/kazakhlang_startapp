const API_BASE = import.meta.env.VITE_API_BASE || 'http://127.0.0.1:8000'
export async function getAnimals() {
  const response = await fetch(`${API_BASE}/animals`)
  if (!response.ok) {
    throw new Error('Жануарлар тізімі жүктелмеді')
  }
  return response.json()
}

export async function getAnimalById(id) {
  const response = await fetch(`${API_BASE}/animals/${id}`)
  if (!response.ok) {
    throw new Error('Жануар туралы дерек жүктелмеді')
  }
  return response.json()
}

export async function createDonation(payload) {
  const response = await fetch(`${API_BASE}/donate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Қолдау ақпараты сақталмады')
  }
  return response.json()
}

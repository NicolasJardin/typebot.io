export type TemplatesGetResponse = {
  status: 'success' | 'error'
  templates: [
    {
      name: string
      language: string
      status: string
      category: string
      id: string
    }
  ]
}

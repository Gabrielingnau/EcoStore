export const siteConfig = {
  name: "Ignite Shop",
  url: "https://igniteshop.com",
  description: "Sua loja de camisetas exclusivas.",
  contact: {
    email: "contato@igniteshop.com",
    phone: {
      raw: "5511999999999", // Apenas números para o link do WhatsApp
      formatted: "(11) 99999-9999", // Exibição visual para o usuário
    },
    address: {
      street: "Rua Exemplo, 123",
      city: "São Paulo",
      state: "SP",
      formatted: "Rua Exemplo, 123 — São Paulo, SP",
    },
  },
};

// Facilita se você quiser exportar diretamente a constante de contato
export const siteContact = siteConfig.contact;
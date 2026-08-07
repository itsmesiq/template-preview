# Template Preview

> Fast local development for HTML email templates powered by Scriban.

<p align="center">
  <img src="https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white">
  <img src="https://img.shields.io/badge/Chokidar-4CAF50?style=for-the-badge">
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
</p>

Template Preview is a lightweight development tool that renders HTML email templates locally using Scriban and mock data.

It eliminates the need to repeatedly publish template changes just to validate the final output, making the development workflow faster and more efficient.

> 🚧 **Current status:** MVP. The project is actively evolving with a new architecture and developer experience improvements.

<br>

## 💡 Why?

Modern frontend development offers an excellent local experience: save a file, refresh (or hot reload), and immediately see the result.

HTML email development is often different. In many platforms, validating even a small change requires publishing or deploying the template before checking the final output.

Template Preview was created to bring that same rapid feedback loop to email template development, allowing templates to be rendered locally with Scriban and mock data.

<br>

## ✨ Features

Current MVP features:

- Local rendering of Scriban templates
- JSON-based mock data
- Live reload during development
- Reusable template components
- Static asset support (CSS, images, fonts...)
- Lightweight development server

<br>

## 📐 Architecture

The rendering pipeline is organized into independent modules, making the engine easier to evolve and maintain.

```text
   HTML Template
(with Scriban syntax)
         │
         ▼
       Parser
         │
         ▼
      Renderer
         │
         ▼
      Runtime
         │
         ▼
   Rendered HTML
         │
         ▼
  Browser Preview
```

This architecture is being continuously refined as the project evolves.

<br>

## ⚡ Getting Started

### Requirements

- Node.js 22+
- pnpm

### Installation

Clone the repository:

```bash
git clone https://github.com/itsmesiq/template-preview.git
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

After starting the server, open the local address displayed in the terminal.

<br>

## 📚 Usage

### 1. Add your templates

Place your templates inside:

```text
templates/
```

---

### 2. Create mock data

Create JSON files containing the data used to render each template.

```text
mock/
```

---

### 3. Reusable components

Store reusable template components inside:

```text
templates/components/
```

Register them in:

```text
templates/components/components.json
```

---

### 4. Start developing

Run:

```bash
pnpm dev
```

Any change made to templates or mock data will automatically update the preview.

<br>

## 📁 Project Structure

```text
.
├── mock/
├── public/
├── src/
│   ├── engine/
│   ├── functions/
│   ├── loaders/
│   ├── parser/
│   ├── renderer/
│   ├── runtime/
│   ├── utils/
│   └── server.ts
└── templates/
    ├── components/
    └── config/
```

The architecture is intentionally modular so new renderers, functions and template features can be added without affecting the entire project.

<br>

## 🎯 Design Principles

Template Preview is built around a few core principles:

- Fast feedback during development
- Minimal setup
- Modular architecture
- Easy extensibility

<br>

## 🚀 Roadmap

### Current MVP

- ✅ Local template rendering
- ✅ Mock data support
- ✅ Live reload

<br>

> The project is evolving in two main directions.

### Rendering Engine

- [ ] Refactor the rendering pipeline
- [ ] Better separation of responsibilities
- [ ] API documentation with Swagger
- [ ] Improved error handling
- [ ] Unit tests

### Developer Experience

- [ ] React + Next.js interface
- [ ] Template explorer
- [ ] Mock data editor
- [ ] Component management
- [ ] Live console

<br>

## 📄 License

MIT License

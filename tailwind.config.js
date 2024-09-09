/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "main-background": "var(--main-background)",
        "panel-background": "var(--panel-background)",
        "sidebar-background": "var(--sidebar-background)",
        "workspace-active": "var(--workspace-active)",
        "main-border": "var(--main-border)",
        "active-chat": "var(--active-chat)",
        "hover-chat": "var(--hover-chat)",
        "hover-active-chat": "var(--hover-active-chat)",
        "msg-user-border": "var(--msg-user-border)",
        "msg-user-body": "var(--msg-user-body)",
        "msg-assistent-border": "var(--msg-assistent-border)",
        "msg-assistent-body": "var(--msg-assistent-body)",
        "chat-color-text": "var(--chat-color-text)",
        "control-element": "var(--control-element)",
      },
      maxWidth: {
        "chat-content": "var(--chat-content-width)",
      },
    },
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["postcss-loader"],
        type: "css",
      },
    ],
  },
};

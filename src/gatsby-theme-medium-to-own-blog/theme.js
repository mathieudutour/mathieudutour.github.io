import defaultTheme from "gatsby-theme-medium-to-own-blog/src/theme"

export default {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    text: "#f5f5f5",
    primary: "#38d0c4",
    background: "#001724",
    codeBackground: "#2E3440",
    muted: "rgba(255, 255, 255, 0.68)",
    grey: "rgba(255, 255, 255, 0.54)",
    boxShadow: "rgba(255, 255, 255, 0.04)",
    separator: "rgba(255, 255, 255, 0.09)",
    categories: {
      SVG: {
        background: "#99ffa0",
        text: "#12702e",
      },
      "Design Version Control": {
        background: "#fde876",
        text: "#735f00",
      },
      Vision: {
        background: "#c0e6ff",
        text: "#325c80",
      },
      "Sketch Plugin": {
        background: "#ffd4a0",
        text: "#a53725",
      },
    },
  },
  highlighting: {
    // https://github.com/PrismJS/prism-themes/blob/master/themes/prism-nord.css
    styles: [
      {
        types: ["comment", "prolog", "doctype", "cdata"],
        style: {
          color: "#636f88",
          fontStyle: "italic",
        },
      },
      {
        types: ["punctuation"],
        style: {
          color: "#81A1C1",
        },
      },
      {
        types: ["namespace"],
        style: {
          opacity: 0.7,
        },
      },
      {
        types: ["property", "tag", "constant", "symbol", "deleted"],
        style: {
          color: "#81A1C1",
        },
      },
      {
        types: ["number"],
        style: {
          color: "#B48EAD",
        },
      },
      {
        types: ["booleean"],
        style: {
          color: "#81A1C1",
        },
      },
      {
        types: [
          "selector",
          "attr-name",
          "string",
          "char",
          "builtin",
          "inserted",
        ],
        style: {
          color: "#A3BE8C",
        },
      },
      {
        types: ["operator", "entity", "url", "variable"],
        style: {
          color: "#81A1C1",
        },
      },
      {
        types: ["atrule", "attr-value", "function", "class-name"],
        style: {
          color: "#88C0D0",
        },
      },
      {
        types: ["keyword"],
        style: {
          color: "#81A1C1",
        },
      },
      {
        types: ["regex", "important"],
        style: {
          color: "#EBCB8B",
        },
      },
    ],
  },
}

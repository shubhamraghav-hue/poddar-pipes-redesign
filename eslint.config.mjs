import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const eslintConfig = [
  // `eslint .` (the lint script) walks the whole repo — skip build output,
  // tooling and static assets so only source is linted.
  {
    ignores: [
      "build/**",
      ".claude/**",
      ".next/**",
      "node_modules/**",
      "public/**",
      "scripts/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Conventional escape hatch: a leading underscore marks a binding that is
  // unused on purpose (e.g. `const { field: _cleared, ...rest } = errors`
  // to omit a key from a copy).
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default eslintConfig;

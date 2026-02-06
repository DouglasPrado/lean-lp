module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // New feature
        "fix", // Bug fix
        "docs", // Documentation
        "style", // Formatting, no code change
        "refactor", // Code restructuring
        "perf", // Performance improvement
        "test", // Adding/updating tests
        "build", // Build system or dependencies
        "ci", // CI configuration
        "chore", // Maintenance tasks
        "revert", // Revert a commit
      ],
    ],
    "subject-case": [2, "never", ["start-case", "pascal-case", "upper-case"]],
    "subject-max-length": [2, "always", 72],
  },
}

export type Role = "Admin" | "Author" | "User";

export const Roles = {
  Admin: "Admin",
  Author: "Author",
  User: "User",
} as const;

export function hasRole(userRole: Role, required: Role | Role[]) {
  const list = Array.isArray(required) ? required : [required];
  return list.includes(userRole);
}

// Common policies for a blog
export const Policies = {
  manageUsers: ["Admin"] as Role[],
  managePosts: ["Admin", "Author"] as Role[],
  readOnly: ["Admin", "Author", "User"] as Role[],
};

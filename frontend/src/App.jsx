import { createElement, useState } from "react";
import AveragePage from "./AveragePage.jsx";
import GradesPage from "./GradesPage.jsx";
import LoginPage from "./LoginPage.jsx";
import SubjectsPage from "./SubjectsPage.jsx";
import { loginStudent } from "./services/api.js";

export default function App() {
  const [page, setPage] = useState("subjects");
  const [session, setSession] = useState(null);

  async function handleLogin(credentials) {
    const response = await loginStudent(credentials);
    setSession(response.data);
    setPage("subjects");
  }

  function signOut() {
    setSession(null);
    setPage("subjects");
  }

  if (!session) {
    return createElement(LoginPage, { onLogin: handleLogin });
  }

  const pageContent =
    page === "grades"
      ? createElement(GradesPage, { token: session.token, student: session.student })
      : page === "average"
        ? createElement(AveragePage, { token: session.token, student: session.student })
        : createElement(SubjectsPage, { token: session.token });

  return createElement(
    "div",
    { className: "app-shell" },
    createElement(
      "nav",
      { className: "portal-navigation", "aria-label": "Student portal" },
      createElement(
        "span",
        { className: "portal-navigation-user" },
        `Signed in as ${session.student.username}`,
      ),
      createElement(
        "div",
        { className: "portal-navigation-links" },
        createElement("button", { type: "button", onClick: () => setPage("subjects") }, "Subjects"),
        createElement("button", { type: "button", onClick: () => setPage("grades") }, "Grades"),
        createElement("button", { type: "button", onClick: () => setPage("average") }, "Average"),
        createElement("button", { type: "button", onClick: signOut }, "Sign out"),
      ),
    ),
    pageContent,
  );
}

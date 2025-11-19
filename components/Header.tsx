// Reusable header component

export function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><strong><a href="/">Maths Wizards</a></strong></li>
        </ul>
        <ul>
          <li><a href="/lessons">Lessons</a></li>
          <li><a href="/blog">Blog</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </nav>
    </header>
  );
}

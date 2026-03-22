const fs = require('fs');

const files = [
  'src/app/(home)/component/ContactSection.tsx',
  'src/app/(home)/component/HeroSection.tsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/don't/g, "don&apos;t");
  content = content.replace(/Let's/g, "Let&apos;s");
  content = content.replace(/I'm/g, "I&apos;m");
  content = content.replace(/doesn't/g, "doesn&apos;t");
  content = content.replace(/you're/g, "you&apos;re");
  content = content.replace(/"Let's build something brilliant together"/g, "&quot;Let&apos;s build something brilliant together&quot;");
  fs.writeFileSync(file, content);
});

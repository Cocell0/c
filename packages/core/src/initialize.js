function initialize(name) {
  if (window.location.href.includes(`perchance.org/${name}`)) {
    const baseElement = document.querySelector('base');

    if (baseElement) {
      baseElement.href = `https://perchance.org/${name}`;
    } else {
      const baseElement = document.createElement("base");
      baseElement.href = `https://perchance.org/${name}`;

      document.head.prepend(baseElement);
    }
  }
}

export { initialize };
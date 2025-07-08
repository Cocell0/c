function initialize(name) {
  if (window.location.href.includes('perchance.org/')) {
    // console.log('Location includes perchance.org/')
    if (window.location.href.includes(`perchance.org/${name}`)) {
      // console.log(`Location includes perchance.org/${name}`)
      const baseElement = document.querySelector('base');

      if (baseElement) {
        baseElement.href = `https://perchance.org/${name}`;
      } else {
        const baseElement = document.createElement("base");
        baseElement.href = `https://perchance.org/${name}`;

        document.head.prepend(baseElement)
      }
    } else {
      // console.log(`Location does NOT includes perchance.org/${name}`)
      alert(`Project location invalid, opening original location:\nperchance.org/${name}`)
      window.open(`https://perchance.org/${name}`, '_self')
    }
  }

  const fontString = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">'

  document.head.innerHTML += fontString;
}

export { initialize };
const d = document;
const $shows = d.querySelector('.shows');
const $template = d.querySelector('.show-template').content;
const $fragment = d.createDocumentFragment();

d.addEventListener('keypress', async (e) => {
  if (e.target.matches('#search')) {
    if (e.key === 'Enter') {
      try {
        // Carga loader
        $shows.innerHTML = `<div class="loader lds-ellipsis"><div></div><div></div><div></div><div></div></div>`;

        let query = e.target.value.toLowerCase();
        let enpoint = `http://api.tvmaze.com/search/shows?q=${query}`;
        let response = await fetch(enpoint);
        let json = await response.json();

        // console.log(json);

        if (!response.ok)
          throw { status: response.status, statusText: response.statusText };

        if (json.length === 0) {
          $shows.innerHTML = `<h2>No existen resultados</h2>`;
        } else {
          json.forEach((el) => {
            // Title
            $template.querySelector('.show__title').textContent = el.show.name;

            // Description
            $template.querySelector('.show__description').innerHTML =
              el.show.summary || 'Sin descripcion';

            // Image
            $template.querySelector('.show__image').src = el.show.image
              ? el.show.image.medium
              : 'http://static.tvmaze.com/images/no-img/no-img-portrait-text.png';
            $template.querySelector('.show__image').alt = el.show.name;

            // Anchor
            $template.querySelector('.show_anchor').textContent = el.show.url
              ? 'Ver mas'
              : '';
            $template.querySelector('.show_anchor').href = el.show.url || '#';
            $template.querySelector('.show_anchor').target = el.show.url
              ? '_blank'
              : '_self';

            let $clone = d.importNode($template, true);
            $fragment.appendChild($clone);
          });

          $shows.innerHTML = '';
          $shows.appendChild($fragment);
        }
      } catch (error) {
        console.log(error);
        let message = errror.statusText || 'Ocurrió un error';
        $shows.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
      }
    }
  }
});

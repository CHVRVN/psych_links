document.addEventListener('DOMContentLoaded', ()=>{
  const pages = [
    ['index.html','Home'],
    ['literature-review.html','Literature Review'],
    ['coding.html','Thematic Codebook'],
    ['discussion.html','Discussion'],
    ['intervention.html','Proposed Intervention'],
    ['pilot.html','Pilot Evaluation'],
  ];
  const here = location.pathname.split('/').pop() || 'index.html';
  const nav = document.createElement('nav');
  nav.className = 'top';
  nav.innerHTML = `<div class="nav-inner"><span class="brand">📓 Ed. Systems Study</span>
    ${pages.map(([f,l])=>`<a href="${f}" class="${f===here?'active':''}">${l}</a>`).join('')}</div>`;
  document.body.prepend(nav);
});

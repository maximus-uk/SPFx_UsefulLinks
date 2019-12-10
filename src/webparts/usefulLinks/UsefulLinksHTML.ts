export default class UsefulLinksHTML {
    public static templateHtml: string =  `
    <div id="accordion">

    <div class="card">
      <div class="card-header accordionToggle">
        <a class="card-link" data-toggle="collapse" href="#collapseOne">
          <h5>Collapsible Group Item #1</h5>
        </a>
      </div>
      <div id="collapseOne" class="collapse" data-parent="#accordion">
        <div class="card-body">
          Lorem ipsum..
        </div>
      </div>
    </div>
  
    <div class="card">
      <div class="card-header accordionToggle">
        <a class="collapsed card-link" data-toggle="collapse" href="#collapseTwo">
          <h5>Collapsible Group Item #2</h5>
        </a>
      </div>
      <div id="collapseTwo" class="collapse" data-parent="#accordion">
        <div class="card-body">
          Lorem ipsum..
        </div>
      </div>
    </div>
  
    <div class="card">
      <div class="card-header accordionToggle">
        <a class="collapsed card-link" data-toggle="collapse" href="#collapseThree">
          <h5>Collapsible Group Item #3</h5>
        </a>
      </div>
      <div id="collapseThree" class="collapse" data-parent="#accordion">
        <div class="card-body">
          Lorem ipsum..
        </div>
      </div>
    </div>
  </div>`;
}
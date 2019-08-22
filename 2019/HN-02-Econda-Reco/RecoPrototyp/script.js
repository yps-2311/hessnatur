
// var widget = new econda.recengine.Widget({
//     element: document.getElementById('ecRecommendationsContainer'),
//     accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
//     id: 93,
//     context: {
//         products: [{id: 'prodId1'}],
//         categories: {
//             type: 'brand',
//             path: 'econda'
//         }
//     }
//  });
//  widget.render();



// econdaConfig.debug = true;
// econdaConfig.debugOutputContainer = '#TrackingResult';

// /**
//  * Setup widget, load data and render using defined template
//  * We use jQuery syntax here which is available if jQuery is loaded
//  */
// var widget = new econda.recengine.Widget({
//     element: '#ecRecommendationsContainer .inner',
//     renderer: {
//         type: 'template',
//         uri: '../templates/template.htm'
//     },
//     accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
//     id: 8,
//     context: {
//         products: [{id:'prodId1'}, {id: 'prodId2'}],
//         categories: [{
//             type: 'brand',
//             path: 'econda'
//         }]
//     }
// });
// widget.render();







// econdaConfig = {
//     debug: true,
//     debugOutputContainer: '#TrackingResult'
// };
var widget = new econda.recengine.Widget({
  element: document.getElementById('ecRecommendationsContainer'),
  accountId: '00002762-7fbb585b-0c52-33a0-ad30-b2319526ea2f-1',
  id: 90,
  context: {
      products: [{ id: 'prodId1' }, { id: 'prodId2' }]
  }
});
widget.render();



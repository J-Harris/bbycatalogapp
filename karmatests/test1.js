/**
 *  Karma Jasmine Test Framework for bbycatalogapp
 */


describe("bbycatalogapp", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

describe("Categories - Asynchronous", function() {
	  var value1 = 0; 
	  var myCategories = Categories;
	
		myCategories.initView (appConfig, '#subCategoriesTemplate', 'div#categories_list ul');

	  beforeEach(function(done) {
		console.log ('invoking Categories.initView');
	    setTimeout(function() {
	      value1++;
	      console.log ('beforeEach timeout completed');
	      done();
	    }, 2001);
	  });
	
	  it("should be fetchable from appConfig hostURI", function() {
		 
		console.log (appConfig);
//		console.log (myCategories);
		expect(myCategories.categories).toBeDefined();
		console.log (myCategories.categories);
		expect(myCategories.promise).not.toBe(null);
		expect(myCategories.categories).not.toBe(null);
	    expect(value1).toBeGreaterThan(0);
		//expect(Categories.categories.subCategories.length).toBe(19);
	  });
	});

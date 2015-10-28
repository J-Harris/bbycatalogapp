//delete localStorage['categories'];

var Categories = {

	appConfig:	null,
	promise:	null,
	categories: null,
	
	initView: function (appConfig, templateId, targetUL) {

		this.appConfig = appConfig;
		this.getSubCategories (this.appConfig);
		
		this.promise.then(function () {
			Categories.showSubCategories (templateId, targetUL);
		});
	},
	
	getSubCategories: function (appConfig) {
		// read from cache if enabled and present
		if (appConfig.useLocalStorageCache) {
			var categoriesText = localStorage.getItem ('categories');
			if (categoriesText != null) {
				this.categories = JSON.parse (categoriesText);
				console.log ('retrieved subCategories from localStorage: ', this.categories.subCategories.length)
				this.promise = Promise.resolve(this.categories);
			}
		}
		
		if (this.categories == null) {
				
			// read from live URL
			this.promise = $.ajax ({
				url: appConfig.hostURI + appConfig.categoryFetchURL,
				dataType: 'jsonp'
			})
			.done (function (categoryData) {
			    if ( console && console.log ) {
			    	console.log( "done Fetch of Live categoryData:", categoryData );
			    }
				console.log ('retrieved subCategories from live URL: ', categoryData.subCategories.length)
			    
				// save result to cache
			    if (appConfig.useLocalStorageCache) {
			    	var categoriesText = JSON.stringify (categoryData);
			    	localStorage.setItem ('categories', categoriesText);
			    }
				this.promise = Promise.resolve(categoryData);
			    
			})
			.fail (function (jqXHR, textStatus, errorThrown) {
				console.log ("failed to fetch from: " + this.url);
				throw { name: 'Fetch Error', message: 'failed to fetch from: ' + this.url }
			});
		}
	},
	
	showSubCategories: function (templateId, targetUL) {
		var template = $(templateId).html();
		Mustache.parse(template);
		this.categories.subCategories.forEach (function (element, index) {
				var renderedHTML = Mustache.render (template, { catid: element.id, name: element.name });
				$(targetUL).append (renderedHTML);
			}
		);
		
		// wire up click event
		$('li.subCategoryLink').on('click', null, function(event) {
			console.log (this);
			var catid = $(this).data('catid');
			$(document).trigger ('categoryRefresh', [ catid ]);
		});
		
		// trigger show the first product
		$('li.subCategoryLink')[0].click();
	}
}
		

A simple SASS skin that only customize the  base SC sass variables to modify the text colors. 

#Installation

In distro.json:

 * make sure this module is included in the "modules" array

 * add this section to the ns.package.json (and correct the version accordingly): 

	"overrides": {
		"suitecommerce/BaseSassStyles@1.0.0/Sass/variables/_colors.scss": "Sass/_colors.scss"
	}

 * Include the following in the "dependencies" array of desired application: 

    {
        "module": "NightSkin",
        "include": ["night_skin_extras"]
    }
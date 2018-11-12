# bibbox-statistics
GUI for statistical elements on bibbox.bbmri-eric.eu

1. Install Webpack globally with `npm install --save webpack`
2. Configure the React components you want to compile in **webpack.config.js**
3. Run `Webpack -w` from root to compile the files at every change.

### Statistic values
The statistic values are all fetched from Elastic Search. While The left side of the statistics overview is calculated automatically, the right side has to be updated by hand. To do this, open up Postman or any other Request Tool and run the following request:

PUT -> http://bibbox-hq-elastic.tools.bbmri-eric.eu/bibbox/technical/1

Body (JSON):
{
	"store_apps": 41,
	"apps_reviewed": 19,
	"docker_images": 34,
	"docker_downloads": 3285,
	"git_commits": 3710
}

If the update was successful, you should get a response like this:

{
    "_index": "bibbox",
    "_type": "technical",
    "_id": "1",
    "_version": 2,
    "result": "updated",
    "_shards": {
        "total": 2,
        "successful": 1,
        "failed": 0
    },
    "created": false
}

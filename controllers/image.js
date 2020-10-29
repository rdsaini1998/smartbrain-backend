const Clarifai = require('Clarifai');

const app = new Clarifai.App({
  apiKey: '93f5058b21fd4acab77ab4d75200af73'
});

const handleClarifaiCall = (req,res) => {
	const {input} = req.body;
	app.models.predict(Clarifai.FACE_DETECT_MODEL,input)
	.then(response => {
		res.json(response);
	})
	.catch(err => res.status(400).json('Unable to find face'))
}

const handleNewImage = (req,res,db) => {
	const {id} = req.body;
	db('users').where({id : id})
	.increment('entries',1)
	.returning('entries')
	.then(entries => {
		if(entries.length > 0){
			res.json(entries[0]);
		}else{
			res.status(400).json('Could not update entries');
		}
	})
	.catch(err => {
		res.status(400).json('Error updating entries');
	})
}

module.exports = {
	handleNewImage,
	handleClarifaiCall
};
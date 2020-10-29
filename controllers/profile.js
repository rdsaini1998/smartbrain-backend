const getProfileWithId = (req,res,db) => {
	const {id} = req.params;
	db.select('*').from('users').where({
		id : id
	})
	.then(user => {
		if(user.length > 0){
			res.json(user[0]);
		}else{
			res.status(404).json({message : 'Not found'});
		}
	})
	.catch(err => res.status(400).json('Error finding user'))
}

module.exports = {
	getProfileWithId
};
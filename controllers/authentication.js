const handleSignIn = (db,bcrypt) => (req,res) => { // Javascript syntax covered in Advanced Javascript
	db.select('email','hash').from('login')
	.where('email','=',req.body.email)
	.then(data => {
		const isValid = bcrypt.compareSync(req.body.password,data[0].hash);
		if(isValid){
			return db.select('*').from('users')
			.where('email','=',req.body.email)
			.then(user => {
				res.json(user[0])
			})
			.catch(err => res.status(400).json('Unable to get user'))
		}else{
			res.status(400).json('Wrong credentials');
		}
	})
	.catch(err => res.status(400).json('Wrong credentials'))
}

const handleNewRegistration = (req,res,db,bcrypt) => {
	const {email, password, name} = req.body;
	if(!email || !password || !name){
		return res.status(400).json('Unable to register');
	}
	const hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		trx.insert({
			hash : hash,
			email : email
		})
		.into('login')
		.returning('email')
		.then(loginEmail => {
			return trx('users')
				    .returning('*')
					.insert({
						email : loginEmail[0],
						name : name,
						joined : new Date()
					})
					.then(user => {
						res.json(user[0]);
					})
		})
		.then(trx.commit)
		.catch(trx.rollback)
	})
	.catch(err => {
		res.status(400).json({message : 'Unable to register'})
	})
}

module.exports = {
	handleSignIn,
	handleNewRegistration
};
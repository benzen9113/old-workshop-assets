const fs = require('fs-promise'); // fs 코어 모듈의 콜백 기반 API를 promise로 대체한 모듈
const path = require('path');
const dataFilePath = path.join(__dirname, 'data');

module.exports = {
	getAll: getAll,
	getList: getList,
	addToList: addToList,
	deleteFromList: deleteFromList
};

function getAll(){
	return fs.readFile(dataFilePath).then(JSON.parse);
}

// user_id의 유저의 리스트를 가져온다.
function getList(user_id){
	return fs.readFile(dataFilePath).then(data => {

		data = JSON.parse(data);
		let user = data.find(user => user.id == user_id);

		return user.list;
	});
}

// user_id의 유저의 리스트에 아이템을 추가한다.
function addToList(user_id, item){
	return fs.readFile(dataFilePath).then(data => {

		if (item) { // 일종의 데이터 검증...
			data = JSON.parse(data);
			data.find(user => user.id == user_id).list.push(item);
			data = JSON.stringify(data);

			return fs.writeFile(dataFilePath, data);
		}
	});
}

// user_id의 유저의 리스트에서 item_index번째 아이템을 삭제한다.
function deleteFromList(user_id, item_index){
	return fs.readFile(dataFilePath).then(data =>{

		data = JSON.parse(data);
		data.find(user => user.id == user_id).list.splice(item_index, 1);
		data = JSON.stringify(data);

		return fs.writeFile(dataFilePath, data);
	});
}
var expect = require('expect.js');
var MySqlRepository = require('../../components/MySqlRepository.js');

describe("MySqlRepository", function() {
	it("format query", function() {
		var sql = 'select * from a where id = :id';
		var values =  {
			id: 5
		};

		var repository = new MySqlRepository();
		var result = repository.formatQuery(sql, values);

		var expected = 'select * from a where id = 5';
		expect(result).to.equal(expected);
	});
});
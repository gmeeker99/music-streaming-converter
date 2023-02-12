import queryString from "query-string"

console.log(
	queryString.stringify({
		test: "test1",
		name: "gavin",
		age: 5,
	})
)

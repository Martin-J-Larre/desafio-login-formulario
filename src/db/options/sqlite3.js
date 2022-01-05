const options = {
	client: "sqlite3",
	connection: { filename: "./src/db/products.sqlite" },
	useNullAsDefault: true,
};

export { options };
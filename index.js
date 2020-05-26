const express = require("express")
const jwt = require("jsonwebtoken");
const server = express();
const key = "dddddddddkjdasl;fjaow;eijfskdljfasdccccd";
server.use(express.json())
server.use((req, res, next) => {
  console.log(`${req.method} - ${req.path} - ${JSON.stringify(req.query)} - ${JSON.stringify(req.body)}`)
  if (req.path === '/login' || req.path === '/register')
    next();
  else {
    // TODO: Verificar el token
    console.log("Sigue con la autenticación");
  }
});
server.listen(process.env.PORT||3500, () => {
  console.log('Bienvenido a la API de Delilah Restó');
})
server.post('/login', (req, res) => {
  const {usr, pass} = req.body
  const valido = validateUsr(usr, pass);
  if (!valido) {
    res.status(401);
    res.json({error: 'No lo conozco perrito'});
    return
  }
  const token = jwt.sign({usr}, key);
  res.json(token);
})
server.post('/register', (req, res) => {
  res.json({respuesta: "Ahí está el registro"});
})

server.get('/', (req, res) => {
  res.json({respuesta: "Bienvenido a la API de Delilah Restó"});
})
server.get('/products', (req, res) => {
  res.json({respuesta: "Ahí estan los productos"});
})
server.get('/products/:id', (req, res) => {
  res.json({respuesta: `Ahí estan el producto ${req.params.id}`});
})
server.put('/products/:id', (req, res) => {
  res.json({respuesta: `Ahí estan el producto ${req.params.id}`});
})
server.delete('/products/:id', (req, res) => {
  res.json({respuesta: `Va a eliminar el producto ${req.params.id}`});
})
server.get('/orders', (req, res) => {
  res.json({respuesta: "Ahí estan los pedidos"});
})
server.get('/orders/:id', (req, res) => {
  res.json({respuesta: `Ahí estan el pedido ${req.params.id}`});
})
server.put('/orders/:id', (req, res) => {
  res.json({respuesta: `Ahí estan el pedido ${req.params.id}`});
})
server.delete('/orders/:id', (req, res) => {
  res.json({respuesta: `Va a eliminar el pedido ${req.params.id}`});
})

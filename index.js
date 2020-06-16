const express = require("express")
const server = express();
const jwt = require("jsonwebtoken");
const key = "alkfajeio;wfsdf]as=faflanvdasoa;wweejfkvf";
const bodyParser = require('body-parser');
const Sequelize = require("sequelize");
const sql = new Sequelize("mysql://delilahresto_db_user:delilahresto_db_pass@localhost:3306/delilahresto");
const SwaggerDocs = require('swagger-docs');
const swagger = require('./swagger.json');
// ===================================================================
//                            Middlewares
// ===================================================================
// =========================== Express ===============================
server.use(express.json());
// ========================== BodyParser =============================
server.use(bodyParser.json());
// ========================== SwaggerDocs =============================
server.use(SwaggerDocs.middleWare(swagger, {path: '/docs'}));
// ========================== Autenticación ===========================
server.use((req, res, next) => {
  console.log(`${req.method} - ${req.path} - ${JSON.stringify(req.query)} - ${JSON.stringify(req.body)}`)
  if (req.path === '/login' || req.path === '/register' || req.path === '/')
    next();
  else {
    try {
      const token = req.headers.authorization;
      const token_user = jwt.verify(token, key);
      if (token_user) {
        req.user = token_user;
        return next();
      }
    } catch (e) {
      console.error(e.message);
      res.statusCode = 401;
      res.json({error: "Su token no es válido, inicie sesión nuevamente para continuar"});
    }
  }
});
// ========================== Autorización ===========================
const isAdmin = (req, res, next) => {
  if (req.user.is_admin) {
    return next();
  } else {
    res.statusCode = 403;
    res.json({error: "No tiene permisos para realizar esta operación"});
  }
}
// ===================================================================
//                              Usuarios
// ===================================================================
// ============================= Login ===============================
server.post('/login', (req, res) => {
  sql.query('SELECT * FROM user WHERE (user_name=? OR email=?) AND password = ?', {
    replacements: [req.body.user, req.body.user, req.body.password],
    type: sql.QueryTypes.SELECT
  })
    .then(user => {
      console.log(JSON.stringify(user) ? `Truly ${JSON.stringify(user)}` : `Falsy ${JSON.stringify(user)}`);
      if (user[0]) {
        const token = jwt.sign(user[0], key);
        console.log(`Bienvenido/a a Delilah Restó ${user[0].full_name}\nTu token es ${token}`);
        res.json({text: `Bienvenido/a a Delilah Restó ${user[0].full_name}`, token: token})
      } else {
        res.status(401);
        res.json({error: 'Correo/Usuario o contraseña incorrectos, verifique la información e intente nuevamente'});
      }
    })
})
// ============================ Registro =============================
server.post('/register', (req, res) => {
  sql.query('INSERT INTO user (full_name, user_name, email, phone, address, password, is_admin) values (?,?,?,?,?,?,?)',
    {replacements: [req.body.full_name, req.body.user_name, req.body.email, req.body.phone, req.body.address, req.body.password, 0]})
    .then(sql_res => {
      console.log(`El usuario ha sido creado con éxito: ID = ${JSON.stringify(...sql_res)}`);
      res.statusCode = 201;
      let user = {
        id: Number(...sql_res),
        ...req.body
      }
      res.json({
        text: "¡El usuario ha sido creado con éxito!",
        user: {
          id: Number(...sql_res),
          full_name: user.full_name,
          user_name: user.user_name,
          email: user.email,
          phone: user.phone,
          address: user.address
        },
        token: jwt.sign(user, key)
      });
    })
    .catch(e => {
      res.statusCode = 400;
      console.error(`${e.message}\nEl usuario no pudo ser creado, verifique la información e intente nuevamente`);
      res.json({error: 'El usuario no pudo ser creado, verifique la información e intente nuevamente'});
    })
})
// ===================================================================
//                            Productos
// ===================================================================
// ========================= VerProductos ============================
server.get('/products', (req, res) => {
  sql.query('SELECT * FROM product', {type: sql.QueryTypes.SELECT}).then(products => {
    if (products.length === 0) {
      console.log(`No hay productos en Delilah Restó`);
      res.json({text: `No hay productos en Delilah Restó`, products: []})
    } else {
      console.log(`Estos son los productos de Delilah Restó: ${JSON.stringify(products)}`);
      res.json({text: 'Estos son los productos de Delilah Restó', products: products})
    }
  })
})
// ======================== CrearProductos ===========================
server.post('/products', isAdmin, (req, res) => {
  sql.query('INSERT INTO product (name, description, price) values (?,?,?)',
    {replacements: [req.body.name, req.body.description, req.body.price]})
    .then(sql_res => {
      console.log(`El producto ha sido creado con éxito: ${sql_res}`);
      res.statusCode = 201;
      res.json({
        text: "¡El producto ha sido creado con éxito!",
        product: {
          id: Number(...sql_res),
          ...req.body
        }
      });
    })
    .catch(e => {
      res.statusCode = 400;
      console.error(`${e.message}\nEl producto no pudo ser creado, verifique la información e intente nuevamente`);
      res.json({error: 'El producto no pudo ser creado, verifique la información e intente nuevamente'});
    })
})
// ====================== VerProducto por ID =========================
server.get('/products/:id', (req, res) => {
  sql.query('SELECT * FROM product WHERE id=?', {
    replacements: [req.params.id],
    type: sql.QueryTypes.SELECT
  }).then(product => {
    if (product.length === 0) {
      res.statusCode = 404;
      console.log(`Este producto no existe`);
      res.json({error: `Este producto no existe`})
    } else {
      console.log(`Información del producto ${product[0].id}: ${JSON.stringify(product[0])}`);
      res.json({text: `Información del producto ${product[0].id}`, product: product[0]})
    }
  })
})
// ======================= ModificarProducto =========================
server.put('/products/:id', isAdmin, (req, res) => {
  sql.query('UPDATE product SET name = ?, description = ?, price = ? WHERE id = ?',
    {replacements: [req.body.name, req.body.description, req.body.price, req.params.id]}).then(() => {
      console.log(`El producto ha sido modificado con éxito`);
      res.json({
        text: "¡El producto ha sido modificado con éxito!",
        product: {
          id: req.params.id,
          ...req.body
        }
      });
    }
  )
})
// ======================= EliminarProducto ==========================
server.delete('/products/:id', isAdmin, (req, res) => {
  sql.query('DELETE FROM product WHERE id = ?',
    {replacements: [req.params.id]}).then(() => {
      res.statusCode = 204;
      res.json();
      console.log(`El producto ha sido eliminado con éxito`);
    }
  )
})
// ===================================================================
//                             Pedidos
// ===================================================================
// ========================== VerPedidos =============================
server.get('/orders', (req, res) => {
  if (req.user.is_admin) {
    sql.query('SELECT * FROM orders', {type: sql.QueryTypes.SELECT}).then(orders => {
      if (orders.length === 0) {
        console.log(`No hay pedidos en Delilah Restó`);
        res.json({text: `No hay pedidos en Delilah Restó`, orders: []})
      } else {
        return orders;
      }
    }).then(orders_products_user).then(orders => {
      console.log(`Estos son los pedidos de Delilah Restó: ${JSON.stringify(orders)}`);
      res.json({text: 'Estos son los pedidos de Delilah Restó', orders: orders})
    })
  } else {
    sql.query('SELECT * FROM orders WHERE user_id=?', {
      replacements: [req.user.id],
      type: sql.QueryTypes.SELECT
    }).then(orders => {
      if (orders.length === 0) {
        console.log(`No ha realizado pedidos en Delilah Restó`);
        res.json({text: `No ha realizado pedidos en Delilah Restó`, orders: []})
      } else {
        return orders;
      }
    }).then(orders_products_user).then(orders => {
      console.log(`Estos son tus pedidos en Delilah Restó: ${JSON.stringify(orders)}`);
      res.json({text: 'Estos son tus pedidos en Delilah Restó', orders: orders})
    })
  }
})
// ========================= EliminarPedido ===========================
server.delete('/orders/:id', isAdmin, (req, res) => {
  sql.query('DELETE FROM orders WHERE id = ?',
    {replacements: [req.params.id]}).then(() => {
      res.statusCode = 204;
      res.json();
      console.log(`La orden ha sido eliminada con éxito`);
    }
  )
})
// ======================== VerPedido por ID ==========================
server.get('/orders/:id', (req, res) => {
  if (req.user.is_admin) {
    sql.query('SELECT * FROM orders WHERE id=?', {
      replacements: [req.params.id],
      type: sql.QueryTypes.SELECT
    }).then(order => {
      if (order[0]) {
        return order[0];
      } else {
        res.statusCode = 404;
        console.log(`Este pedido no existe`);
        res.json({error: `Este pedido no existe`})
      }
    }).then(order_products_user).then(order => {
      console.log(`Información del pedido ${order.id}: ${JSON.stringify(order)}`);
      res.json({text: `Información del pedido ${order.id}`, order: order})
    })
  } else {
    sql.query('SELECT * FROM orders WHERE user_id=? AND id=?', {
      replacements: [req.user.id, req.params.id],
      type: sql.QueryTypes.SELECT
    }).then(order => {
      if (order[0]) {
        return order[0];
      } else {
        res.statusCode = 404;
        console.log(`Este pedido no existe`);
        res.json({error: `Este pedido no existe`})
      }
    }).then(order_products_user).then(order => {
      console.log(`Información del pedido ${order.id}: ${JSON.stringify(order)}`);
      res.json({text: `Información del pedido ${order.id}`, order: order})
    })
  }
})
// ===================== ActualizarEstado Pedido ========================
server.patch('/orders/:id', isAdmin, (req, res) => {
  sql.query('UPDATE orders SET state = ? WHERE id=?',
    {replacements: [req.body.state, req.params.id]}).then(sql_res => {
    if (sql_res[0].affectedRows === 0) {
      res.statusCode = 400;
      res.json({text: `El estado no ha sido actualizado. El pedido ya se encuentra en el estado '${req.body.state}'`});
      throw `El estado no ha sido actualizado. El pedido ya se encuentra en el estado '${req.body.state}'`;
    } else {
      return sql_res
    }
  }).then(() => {
    sql.query('SELECT * FROM orders WHERE id=?', {
      replacements: [req.params.id],
      type: sql.QueryTypes.SELECT
    }).then(order => {
      if (order[0]) {
        return order[0];
      }
    }).then(async order => {
      return await order_products_user(order)
    }).then(order => {
      console.log(`Información del pedido ${order.id}: ${JSON.stringify(order)}`);
      res.json({text: `Información del pedido ${order.id}`, order: order})
    })
  }).catch(e => {
    res.statusCode = 400;
    res.json({text: `El estado no ha sido actualizado. '${req.body.state}' no es un estado válido`});
    throw `El estado no ha sido actualizado. '${req.body.state}' no es un estado válido`;
  })
})

// ======================= Por implementar ===========================
server.post('/orders', isAdmin, (req, res) => {
  sql.query('INSERT INTO orders (description, total_value, user_id, payment, state) values (?,?,?)',
    {replacements: [req.body.description, req.body.total_value, req.body.user_id,]})
    .then(sql_res => {
      console.log(`El pedido ha sido creado con éxito: ${sql_res}`);
      res.statusCode = 201;
      res.json({text: "¡El pedido ha sido creado con éxito!"});
    })
    .catch(e => {
      res.statusCode = 400;
      console.error(`${e.message}\nEl pedido no pudo ser creado, verifique la información e intente nuevamente`);
      res.json({error: 'El pedido no pudo ser creado, verifique la información e intente nuevamente'});
    })
})
// ===================================================================
//                        Funciones auxiliares
// ===================================================================
const order_products_user = async order => {
  let order_products = await sql.query('SELECT product.id, product.name, order_products.product_quantity FROM product, orders,order_products WHERE product.id = order_products.product_id AND order_products.order_id = ? AND orders.id = ?;', {
    replacements: [order.id, order.id],
    type: sql.QueryTypes.SELECT
  });
  order.products = [...order_products];
  order.user = await sql.query('SELECT * FROM user WHERE id = ?', {
    replacements: [order.id],
    type: sql.QueryTypes.SELECT
  })
  return order;
}
const orders_products_user = async orders => {
  for (let i = 0; i < orders.length; i++) {
    let order_products = await sql.query('SELECT product.id, product.name, order_products.product_quantity FROM product, orders,order_products WHERE product.id = order_products.product_id AND order_products.order_id = ? AND orders.id = ?;', {
      replacements: [orders[i].id, orders[i].id],
      type: sql.QueryTypes.SELECT
    });
    orders[i].products = [...order_products];
    orders[i].user = await sql.query('SELECT * FROM user WHERE id = ?', {
      replacements: [orders[i].user_id],
      type: sql.QueryTypes.SELECT
    })
  }
  return orders;
}
// ============================ Listen ===============================
server.listen(process.env.PORT || 3500, () => {
  console.log('Bienvenido a la API de Delilah Restó');
})

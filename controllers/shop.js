const Product = require('../models/product');
// const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(error => {
      console.log('error :>> ', error);
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      console.log('err :>> ', err);
    })

};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(product => {
      res.render('shop/index', {
        prods: product,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(error => {
      console.log('error :>> ', error);
    })
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(cart => {
      return cart.getProducts()
        .then((products) => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch(err => {
          console.log('err :>> ', err);
        })
    })
    .catch(err => {
      console.log('err :>> ', err);
    })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQunatity = 1;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQunatity = oldQuantity + 1
        return product;
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: {
          quantity: newQunatity
        }
      })
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => console.log('err :>> ', err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } })
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy()
    })
    .then(() => {
      res.redirect('/cart')
    })
    .catch(err => {
      console.log('err :>> ', err);
    })
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ['products'] })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      console.log('err :>> ', err);
    })

};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity }
            return product
          }))
        })
        .then(() => {
          return fetchedCart.setProducts(null)
        }).then(() => {
          res.redirect('/orders')
        })
        .catch(errr => {
          console.log('errr :>> ', errr);
        })
    })
    .catch(err => {
      console.log('err :>> ', err);
    })
}

define([
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'underscore',
    'knockout'
], function (Component, customerData, _,ko) {
    'use strict'

    return Component.extend({

        defaults:
            {
                shippingValue : 100,
                subtotal: 0.00,
                template: "Hamza_FreeShippingPromo/free-shipping-promo",
                tracks: {
                    subtotal: true
                }
            },

        initialize: function () {
            this._super();
            var self = this;

            //self.message = self.messageDefault;

            var cart = customerData.get('cart');

            customerData.getInitCustomerData().done(function () {
                if (!_.isEmpty(cart()) && !_.isUndefined(cart().subtotalAmount)) {
                    self.subtotal = parseFloat(cart().subtotalAmount);
                }
            });

            cart.subscribe(function (cart){
                if (!_.isEmpty(cart) && !_.isUndefined(cart.subtotalAmount)) {
                    self.subtotal = parseFloat(cart.subtotalAmount);
                }
            });

            self.message = ko.computed(function(){
                if(self.subtotal === 0)
                {
                    return self.messageDefault;
                }

                if(self.subtotal > 0 && self.subtotal < self.shippingValue){
                    var remainingValue = self.shippingValue - self.subtotal;
                    var formatRemainingValue = self.formatCurrency(remainingValue);
                    return self.messageItemsInCart.replace('$XX.X', formatRemainingValue);
                }

                if(self.subtotal > self.shippingValue){
                    return self.messageFreeShipping;
                }
            });

        },

        formatCurrency: function (val) {
            return '$' + val.toFixed(2);
        }
    });
})

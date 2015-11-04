'use strict';

angular.module('openwheels.invoice2.invoice.edit', [])

.controller('InvoiceEditController', function ($scope, invoice, invoice2Service, alertService) {

  $scope.finished = false; // prevent creating an invoice twice

  $scope.taxRateOptions = [
    { label: '21%', value: 21 },
    { label:  '6%', value:  6 },
    { label:  '0%', value:  0 },
  ];

  $scope.typeOptions = [
    { label: 'Tankbon', value: 'receipt' },
    { label: 'Schade', value: 'damage' },
    { label: 'Verkeersboete', value: 'traffic_ticket' },
    { label: 'Providerboete', value: 'provider_penalty' },
    { label: 'Administratiekosten', value: 'administration_costs' },
    { label: 'Abonnement VGA', value: 'subscription_vga' },

    { label: 'Other', value: 'custom' }
  ];

  $scope.save = function (invoice) {
    return invoice.id ? alterInvoice(invoice) : createInvoice(invoice);
  };

  if (invoice) {
    initExistingInvoice(invoice);
  } else {
    initNewInvoice();
  }

  function initNewInvoice () {
    $scope.invoice = {
      quantity: 1,
      taxRate: $scope.taxRateOptions[0].value
    };
  }

  function initExistingInvoice (invoice) {
    $scope.invoice = invoice;
  }

  function alterInvoice (invoice) {
    alertService.load();

    invoice2Service.alter({ invoice: invoice.id, newProps: invoice }).then(function () {
      $scope.form.$setPristine();
      alertService.add('success', 'Saved', 5000);
    })
    .catch(function (err) {
      alertService.addError(err);
    })
    .finally(function () {
      alertService.loaded();
    });
  }

  function createInvoice (invoice) {
    var params = angular.copy(invoice);

    if (params.sender) { params.sender = params.sender.id; }
    if (params.recipient) { params.recipient = params.recipient.id; }
    if (params.booking) { params.booking = params.booking.id; }

    alertService.load();

    invoice2Service.create(params).then(function () {
      $scope.finished = true;
      alertService.add('success', 'Saved', 5000);
    })
    .catch(function (err) {
      alertService.addError(err);
    })
    .finally(function () {
      alertService.loaded();
    });
  }
})
;

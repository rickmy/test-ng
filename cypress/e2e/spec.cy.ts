describe('Test ng', () => {

  beforeEach(()=> {
    cy.intercept({
      method: 'GET',
      url: 'http://localhost:3002/bp/products'
    }, {
      body: {
        data: [
          {
            id: "test 01",
            name: "Tarjeat de credito",
            description: "es una tarjeta de tipo visa",
            logo: "https://citec.com.ec/wp-content/uploads/2023/10/visa.jpeg",
            date_release: "2024-10-24",
            date_revision: "2025-10-24"
          }, 
          {
            id: "test 02",
            name: "Tarjeat de credito Visa",
            description: "es una tarjeta de tipo visa",
            logo: "https://citec.com.ec/wp-content/uploads/2023/10/visa.jpeg",
            date_release: "2024-11-24",
            date_revision: "2025-11-24"
          }, 
          {
            id: "test 03",
            name: "Tarjeat de credito Visa test",
            description: "es una tarjeta de tipo visa",
            logo: "https://citec.com.ec/wp-content/uploads/2023/10/visa.jpeg",
            date_release: "2024-12-24",
            date_revision: "2025-12-24"
          }
        ]
      }
    });
    cy.visit('/')
  })

  it('Visits the initial project page', () => {
    cy.contains('Lista de Productos')
  });

  it('render 3 elements',()=> {
     cy.get('[data-cy="products"]').should('have.length', 3);
     cy.get('[data-cy="name-product"]').eq(0).should('contain.text', 'Tarjeat de credito');
     cy.get('[data-cy="name-product"]').eq(1).should('contain.text', 'Tarjeat de credito Visa');
     cy.get('[data-cy="name-product"]').eq(2).should('contain.text', 'Tarjeat de credito Visa test');
     
  });

  it('render paginator', ()=> {
    cy.get('[data-cy="btnPage"]').should('have.length', 1);
    cy.get('[data-cy="totalResult"]').should('contain.text', '3 Resultados');
    cy.get('[data-cy="btnLastItem"]').should('be.disabled');
    cy.get('[data-cy="btnNextItem"]').should('be.disabled');

    cy.get('[data-cy="selectPagination"]').should('contain.text', '5');
  });

  it('can change row value', ()=> {
    cy.get('[data-cy="selectPagination"]').select('10')
    cy.get('[data-cy="selectPagination"]').should('contain.text', '10');
  })
})

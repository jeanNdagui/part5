describe("Blog app", function () {
  beforeEach(function () {
    // empty the db here
    cy.request("POST", "http://localhost:3003/api/testing/reset");

    // create a user for the backend here
    const user = {
      name: "ndagui",
      username: "ghost",
      password: "1234567",
    };

    cy.request("POST", "http://localhost:3003/api/users/", user);
    const user1 = {
      name: "melanie",
      username: "ghosti",
      password: "1234567",
    };

    cy.request("POST", "http://localhost:3003/api/users/", user1);
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.visit("http://localhost:5173");
    cy.contains("log in to application");
    cy.get("input:first").should("exist");
    cy.get("input:last").should("exist");
    cy.contains("login");
  });

  describe("Login", function () {
    //logged in
    it("succeeds with correct credentials", function () {
      const user = {
        name: "ndagui",
        username: "ghost",
        password: "1234567",
      };

      cy.get("input:first").type(user.username);
      cy.get(`input[type="password"]`).type(user.password);
      cy.contains("login").click();

      cy.contains("blogs");
      cy.contains(`${user.name} logged in`);
      cy.contains(`logout`);
      cy.contains(`new blog`);
    });

    it("fails with wrong credentials", function () {
      cy.get("input:first").type("user.username");
      cy.get(`input[type="password"]`).type("user.password");
      cy.contains("login").click();

      cy.get(".notification").should("contain", "invalid username or password");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      const user = { username: "ghost", password: "1234567" };
      cy.request("POST", "http://localhost:3003/api/login", user).then(
        (response) => {
          localStorage.setItem(
            "loggedBlogappUser",
            JSON.stringify(response.body)
          );
          cy.visit("http://localhost:5173");
        }
      );
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.get(`input[name="title"]`).type("security by design in sdlc");
      cy.get(`input[name="author"]`).type("Mr Ndagui & Dr.Mani");
      cy.get(`input[name="url"]`).type("http://secure.com");
      cy.get(`input[type="submit"]`).click();

      cy.contains("security by design in sdlc");
    });

    it("A blog can be liked", function () {
      cy.createBlog({
        title: "Mathematics tutorial",
        author: "MATHS-CAM",
        url: "science.com",
        likes: 302,
      });
      cy.contains("Mathematics tutorial").contains("view").click()
      cy.contains("like").click()
    });

  });

  describe("Blog operation", function () {
    beforeEach(function () {
      cy.login( { username: "ghost", password: "1234567" })
      cy.createBlog({
        title: "Mathematics tutorial",
        author: "MATHS-CAM",
        url: "science.com",
        likes: 302,
      });
    });

    it('user who created a blog can delete it.',function(){
      cy.contains("logout").click()
      cy.login({ username: "ghosti", password: "1234567" })

      cy.contains("Mathematics tutorial").contains("view").click()
      cy.contains('remove').click()
      cy.contains('user invalid')

      cy.contains("logout").click()
      cy.login({ username: "ghost", password: "1234567" })
      cy.contains("Mathematics tutorial").contains("view").click()
      cy.contains('remove').click()
      cy.contains('blog was removed ')
    })

    it('only the creator can see the delete button of a blog',function(){
      cy.contains("logout").click()
      cy.login({ username: "ghosti", password: "1234567" })

      cy.contains("Mathematics tutorial").contains("view").click()
      cy.get('#btn-remove').should('have.css','display','none')

      cy.contains("logout").click()
      cy.login({ username: "ghost", password: "1234567" })

      cy.contains("Mathematics tutorial").contains("view").click()
      cy.get('#btn-remove').should('have.css','display','inline-block')
    })


    it.only('blogs are odered by likes',function(){
      cy.createBlog({
        title: "Chimistry tutorial",
        author: "CHIM-CAM",
        url: "science.com",
        likes: 102,
      });

      cy.createBlog({
        title: "Physics tutorial",
        author: "PHYS-CAM",
        url: "science.com",
        likes: 202,
      });
      

      cy.get('.blog').eq(0).should('contain', 'likes 302')
      cy.get('.blog').eq(1).should('contain', 'likes 202')
      cy.get('.blog').eq(2).should('contain', 'likes 102')
    })

  })
});

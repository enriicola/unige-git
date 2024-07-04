package TestCases;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.openqa.selenium.By;

import java.io.IOException;
import java.util.NoSuchElementException;

import TestCases.PO.Bludit.AddNewContentPO;
import TestCases.PO.Bludit.AddNewUserPO;
import TestCases.PO.Bludit.AdminDashboardPO;
import TestCases.PO.Bludit.ChangePasswordPO;
import TestCases.PO.Bludit.ManageContentPO;
import TestCases.PO.Bludit.EditUserPO;
import TestCases.PO.Bludit.UsersPO;
import TestCases.PO.Bludit.LoginAdminPO;
import TestCases.PO.Bludit.EditContentPO;

public class BluditTest extends DriverLifeCycle{

   @Test
   public void test1AddNewContent() throws InterruptedException{
      LoginAdminPO login = new LoginAdminPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      // assertTrue(admin.getUrl().equals("http://localhost:8080/admin/dashboard"));
      //class=uk-icon-pencil
      AddNewContentPO addNewContent = admin.clickAddNewContent();
      String expected = "Test Content";
      ManageContentPO content = addNewContent.addNewContent(expected);

      String actual = content.getFirstPublishedContent();
      assertTrue(actual.equals(expected));
      Thread.sleep(5000);
      assertFalse(base.isIn(By.className("alert-ok")));

      base.doLogout();
   }

   @Test
   public void test2ChangeContentURL() {
      LoginAdminPO login = new LoginAdminPO(driver);
      AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      ManageContentPO manageContent = admin.clickContent();
      EditContentPO content = manageContent.clickContent("Test Content");
      content.changeURL("new-post-url");
      manageContent = admin.clickContent();
      
      String actual = manageContent.getURLof("Test Content");     
      String expected = "/new-post-url";
      assertTrue(actual.equals(expected));

      base.doLogout();
   }

   @Test
   public void test3ChangeContentPosition() throws Exception{
      LoginAdminPO login = new LoginAdminPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      ManageContentPO manageContent = admin.clickContent();
      EditContentPO content = manageContent.clickContent("Test Content");
      content.changePosition("30");
      manageContent = admin.clickContent();
      content = manageContent.clickContent("Test Content");

      String expected = "30";
      String actual = content.getPosition();

      assertTrue(actual.equals(expected));

      base.doLogout();
   }

   @Test
   public void test4ContentParent() throws IOException {
      LoginAdminPO login = new LoginAdminPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      ManageContentPO manageContent = admin.clickContent();
      EditContentPO content = manageContent.clickContent("Test Content");
      content.changeParent();
      manageContent = admin.clickContent();
      content = manageContent.clickContent("Test Content");

      String expected = "Create your own content";
      String actual = content.getParent();

      assertTrue(actual.equals(expected));

      base.doLogout();
   }

   @Test
   public void test5AddNewDradft(){
      LoginAdminPO login = new LoginAdminPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      AddNewContentPO addNewContent = admin.clickAddNewContent();
      String expected = "Draft Content";
      ManageContentPO manageContent = addNewContent.addNewDraft(expected);
      manageContent = admin.clickContent();

      String actual = manageContent.getFirstDraftContent();
      assertTrue(actual.equals(expected));
      assertFalse(base.isIn(By.className("alert-ok")));

      base.doLogout();
   }

   @Test
   public void test6SetStickContent() {
      LoginAdminPO login = new LoginAdminPO(driver);
		AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      ManageContentPO manageContent = admin.clickContent();
      EditContentPO edit = manageContent.clickContent("Set up your new site");
      edit.setSticky();
      manageContent = admin.clickContent();

      String actual = manageContent.getFirstStickyContent();
      assertTrue(actual.equals("Set up your new site"));

      base.doLogout();
   }

   @Test
   public void test7DeleteContent() throws InterruptedException, IOException {
      // test1AddNewContent();
      String contentToDelete = "Test Content";

      LoginAdminPO login = new LoginAdminPO(driver);
      AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      ManageContentPO manageContent = admin.clickContent();

      By locator = By.linkText(contentToDelete);
      
      EditContentPO edit = manageContent.clickContent(contentToDelete);
      manageContent = edit.deleteContent();

      try{
         base.isIn(locator);
      }
      catch (NoSuchElementException e) {
         assertTrue(true);
      }
      Thread.sleep(5000);
      assertFalse(base.isIn(By.className("alert-ok")));

      base.doLogout();
   }

   @Test
   public void test8Adduser() {
      LoginAdminPO login = new LoginAdminPO(driver);
      AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      UsersPO users = admin.clickUsers();
      AddNewUserPO addNewUser = users.goToAddNewUser();
      users = addNewUser.addUser("usertest", "usertest123", "user@test.com", "Administrator");

      String actual = users.getSecondUser();
      String expected = "usertest";

      assertTrue(actual.equals(expected));

      base.doLogout();
   }

   @Test
   public void test9ChangeUserPassword() throws InterruptedException, IOException{
      LoginAdminPO login = new LoginAdminPO(driver);
      AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      UsersPO users = admin.clickUsers();
      EditUserPO edit = users.clickNthUser(2);
      ChangePasswordPO changePsw = edit.clickChangePassword();
      users = changePsw.changePsw("newpassword");
		
      String expected = "The changes have been saved";
		String msg = driver.findElement(By.id("alert")).getAttribute("textContent");

		assertTrue(msg.contains(expected));
      
      String cssValue = driver.findElement(By.id("alert")).getCssValue("display");

      assertTrue(cssValue.equals("block"));

      Thread.sleep(4500);
      cssValue = driver.findElement(By.id("alert")).getCssValue("display");
      assertTrue(cssValue.equals("none"));

		base.doLogout();
   }

   @Test
   public void test10AddSocialNetworkLinks(){
      String fbExpected = "https://www.facebook.com/some_fake_user_name_52432562135863";
      String igExpected = "https://instagram.com/some_fake_user_name_52432562135863";

      LoginAdminPO login = new LoginAdminPO(driver);
      AdminDashboardPO admin = (AdminDashboardPO) login.doLogin("admin", "password");
      UsersPO users = admin.clickUsers();
      EditUserPO edit = users.clickNthUser(1);
      edit.addLinks(By.id("jsfacebook"), fbExpected, By.id("jsinstagram"), igExpected);
      users = admin.clickUsers();
      edit = users.clickNthUser(1);

      String fbActual = edit.getFacebook();
      String igActual = edit.getInstagram();

      assertTrue(fbActual.equals(fbExpected));
      assertTrue(igActual.equals(igExpected));

      base.doLogout();
   }
}
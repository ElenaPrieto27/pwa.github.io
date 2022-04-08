from selenium import webdriver
import time

driver = webdriver.Chrome("DriversC/chromedriver.exe")

driver.get("http://127.0.0.1:8080/")
driver.maximize_window()

driver.find_element_by_id("usuario").send_keys("jorge")
time.sleep(2)
driver.find_element_by_id("pass").send_keys("1234")
time.sleep(2)
driver.find_element_by_id("login").click()
time.sleep(3)

driver.close()
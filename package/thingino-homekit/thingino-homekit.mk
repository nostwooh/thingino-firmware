THINGINO_HOMEKIT_VERSION = 1.0
THINGINO_HOMEKIT_SITE_METHOD = local
THINGINO_HOMEKIT_SITE = $(THINGINO_HOMEKIT_PKGDIR)
THINGINO_HOMEKIT_DEPENDENCIES = go2rtc thingino-webui qrencode

define THINGINO_HOMEKIT_INSTALL_TARGET_CMDS
	$(INSTALL) -D -m 0644 $(THINGINO_HOMEKIT_PKGDIR)/files/go2rtc-homekit.yaml $(TARGET_DIR)/etc/go2rtc-homekit.yaml
	$(INSTALL) -D -m 0644 $(THINGINO_HOMEKIT_PKGDIR)/files/homekit.webui.json $(TARGET_DIR)/var/www/a/plugins/homekit.webui.json
	$(INSTALL) -D -m 0644 $(THINGINO_HOMEKIT_PKGDIR)/files/www/config-homekit.html $(TARGET_DIR)/var/www/config-homekit.html
	$(INSTALL) -D -m 0644 $(THINGINO_HOMEKIT_PKGDIR)/files/www/a/config-homekit.js $(TARGET_DIR)/var/www/a/config-homekit.js
	$(INSTALL) -D -m 0755 $(THINGINO_HOMEKIT_PKGDIR)/files/www/x/json-config-homekit.cgi $(TARGET_DIR)/var/www/x/json-config-homekit.cgi
	$(INSTALL) -D -m 0755 $(THINGINO_HOMEKIT_PKGDIR)/files/www/x/homekit-qr.cgi $(TARGET_DIR)/var/www/x/homekit-qr.cgi
endef

$(eval $(generic-package))

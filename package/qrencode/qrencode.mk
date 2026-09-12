QRENCODE_VERSION = 4.1.1
QRENCODE_SITE = https://github.com/fukuchi/libqrencode/archive/refs/tags
QRENCODE_SOURCE = v$(QRENCODE_VERSION).tar.gz
QRENCODE_LICENSE = LGPL-2.1+
QRENCODE_LICENSE_FILES = COPYING
QRENCODE_DEPENDENCIES = host-pkgconf

$(eval $(autotools-package))
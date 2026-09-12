QRENCODE_VERSION = 4.1.1
QRENCODE_SITE = https://fukuchi.org/works/qrencode
QRENCODE_LICENSE = LGPL-2.1+
QRENCODE_LICENSE_FILES = COPYING
QRENCODE_DEPENDENCIES = host-pkgconf

$(eval $(autotools-package))
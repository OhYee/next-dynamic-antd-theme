#!/bin/bash

ls .. | grep -v example | xargs -L 1 -I file cp -r ../file ./node_modules/next-dynamic-antd-theme
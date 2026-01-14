INVENTORY ?= inventory
VERBOSITY = #-vvv
AUX_TASK ?= 'Deploy stack from a compose file'
VENV_PATH ?= $(HOME)/.venv-ansible
PASSWORD_AUDIT ?= python3 scripts/password_audit.py

#
# Python environment with uv :)
#

UV_BIN := $(shell command -v uv 2>/dev/null || echo "$(HOME)/.local/bin/uv")

$(VENV_PATH):
	@command -v uv >/dev/null 2>&1 || { \
		echo "uv not found. Installing uv..."; \
		curl -LsSf https://astral.sh/uv/install.sh | sh; \
	}
	rm -rf $@
	$(UV_BIN) venv $@

# Marker file to track if setup is complete
$(VENV_PATH)/.setup-complete: $(VENV_PATH) pyproject.toml requirements.yml
	$(UV_BIN) pip install --python $(VENV_PATH)/bin/python -e .
	. $(VENV_PATH)/bin/activate && \
		ansible-galaxy collection install -r requirements.yml
	@touch $@

.PHONY: python-setup
python-setup: $(VENV_PATH)/.setup-complete

#
# Targets
#

.PHONY: setup-all
setup-all: $(VENV_PATH)
	$(MAKE) password-audit
	. $(VENV_PATH)/bin/activate && \
		ansible-playbook -i $(INVENTORY) $(VERBOSITY) playbook.yml
		
.PHONY: setup-from-images-onwards
setup-from-images-onwards: $(VENV_PATH)
	$(MAKE) password-audit
	. $(VENV_PATH)/bin/activate && \
		ansible-playbook -i $(INVENTORY) $(VERBOSITY) playbook.yml \
		--start-at-task='Create /opt/container-images'

.PHONY: setup-from-service-onwards
setup-from-service-onwards: $(VENV_PATH)
	$(MAKE) password-audit
	. $(VENV_PATH)/bin/activate && \
		ansible-playbook -i $(INVENTORY) $(VERBOSITY) playbook.yml \
		--start-at-task='Repull images'

.PHONY: aux
aux: $(VENV_PATH)
	$(MAKE) password-audit
	. $(VENV_PATH)/bin/activate && \
		ansible-playbook -i $(INVENTORY) $(VERBOSITY) playbook.yml \
		--start-at-task=${AUX_TASK}

.PHONY: debug
debug: $(VENV_PATH)
	$(MAKE) password-audit
	. $(VENV_PATH)/bin/activate && \
		export ANSIBLE_FORCE_COLOR=True && \
		clear && \
		ansible-playbook -i $(INVENTORY) $(VERBOSITY) playbook.yml | tee debug.log 

.PHONY: password-audit
password-audit:
	@$(PASSWORD_AUDIT)

.PHONY: clean-vagrant
clean-vagrant:
	vagrant destroy -f
	rm -rf .vagrant

.PHONY: clean-python
clean-python:
	rm -rf $(VENV_PATH)

.PHONY: clean-all
clean-all: clean-vagrant clean-python

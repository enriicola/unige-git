'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '#components/common/Badge';
import { Button } from '#components/common/Button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldSet,
} from '#components/common/Field';
import { Input } from '#components/common/Input';
import Spinner from '#components/common/Spinner';
import useMatchSettings from '#js/useMatchSetting';
import useRoleGuard from '#js/useRoleGuard';
import { MatchSettingStatus } from '#js/constants';
import { getApiErrorMessage } from '#js/apiError';
import styles from './form.module.css';

const IMPORTS_END_MARKER = '// __CODYMATCH_IMPORTS_END__';
const PREFIX_END_MARKER = '// __CODYMATCH_PREFIX_END__';
const SOLUTION_END_MARKER = '// __CODYMATCH_SOLUTION_END__';

const createTestCaseId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `case-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const isBlank = (value) =>
  typeof value !== 'string' || value.trim().length === 0;

const formatTestValue = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};

const parseMaybeJson = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return '';
  try {
    return JSON.parse(trimmed);
  } catch {
    return trimmed;
  }
};

const splitReferenceSolution = (value) => {
  if (!value || typeof value !== 'string') {
    return { imports: '', prefix: '', solution: '', suffix: '' };
  }

  const importsIndex = value.indexOf(IMPORTS_END_MARKER);
  const prefixIndex = value.indexOf(PREFIX_END_MARKER);
  const solutionIndex = value.indexOf(SOLUTION_END_MARKER);

  if (importsIndex !== -1 && prefixIndex !== -1 && solutionIndex !== -1) {
    const imports = value.slice(0, importsIndex).trim();
    const prefix = value
      .slice(importsIndex + IMPORTS_END_MARKER.length, prefixIndex)
      .replace(/^\s*\n?/, '')
      .replace(/\s*$/, '');
    const solution = value
      .slice(prefixIndex + PREFIX_END_MARKER.length, solutionIndex)
      .replace(/^\s*\n?/, '')
      .replace(/\s*$/, '');
    const suffix = value
      .slice(solutionIndex + SOLUTION_END_MARKER.length)
      .replace(/^\s*\n?/, '')
      .replace(/\s*$/, '');

    return {
      imports,
      prefix,
      solution,
      suffix,
    };
  }

  if (importsIndex !== -1) {
    const imports = value.slice(0, importsIndex).trim();
    const rawCode = value.slice(importsIndex + IMPORTS_END_MARKER.length);
    return {
      imports,
      prefix: '',
      solution: rawCode.replace(/^\s*\n?/, ''),
      suffix: '',
    };
  }

  const lines = value.split(/\r?\n/);
  const importLines = [];
  const codeLines = [];
  lines.forEach((line) => {
    if (/^\s*#include\b/.test(line)) {
      importLines.push(line);
    } else {
      codeLines.push(line);
    }
  });
  return {
    imports: importLines.join('\n'),
    prefix: '',
    solution: codeLines.join('\n'),
    suffix: '',
  };
};

const assembleReferenceSolution = (imports, prefix, solution, suffix) => {
  const trimmedImports = typeof imports === 'string' ? imports.trim() : '';
  const safePrefix = typeof prefix === 'string' ? prefix : '';
  const safeSolution = typeof solution === 'string' ? solution : '';
  const safeSuffix = typeof suffix === 'string' ? suffix : '';

  if (
    !trimmedImports &&
    !safePrefix.trim() &&
    !safeSolution.trim() &&
    !safeSuffix.trim()
  ) {
    return '';
  }

  return [
    trimmedImports,
    IMPORTS_END_MARKER,
    safePrefix,
    PREFIX_END_MARKER,
    safeSolution,
    SOLUTION_END_MARKER,
    safeSuffix,
  ]
    .filter((section, index) => section !== '' || index < 2)
    .join('\n\n');
};

const mapTestCases = (tests) => {
  if (!Array.isArray(tests)) return [];
  return tests.map((testCase) => ({
    id: createTestCaseId(),
    input: formatTestValue(testCase?.input),
    output: formatTestValue(testCase?.output),
  }));
};

const isEmptyTestCase = (testCase) => {
  const inputValue =
    typeof testCase.input === 'string' ? testCase.input.trim() : '';
  const outputValue =
    typeof testCase.output === 'string' ? testCase.output.trim() : '';
  return !inputValue && !outputValue;
};

const serializeTestCases = (tests) =>
  tests
    .filter((testCase) => !isEmptyTestCase(testCase))
    .map((testCase) => ({
      input: parseMaybeJson(testCase.input),
      output: parseMaybeJson(testCase.output),
    }));

const getStatusLabel = (status) => {
  if (status === MatchSettingStatus.READY) return 'Ready for use';
  return 'Draft';
};

const getStatusVariant = (status) => {
  if (status === MatchSettingStatus.READY) return 'secondary';
  return 'outline';
};

export default function MatchSettingForm({ matchSettingId = null }) {
  const router = useRouter();
  const { isAuthorized } = useRoleGuard({
    allowedRoles: ['teacher', 'admin'],
  });
  const {
    getMatchSetting,
    createMatchSetting,
    updateMatchSetting,
    publishMatchSetting,
    unpublishMatchSetting,
    duplicateMatchSetting,
  } = useMatchSettings();

  const [currentId, setCurrentId] = useState(matchSettingId);
  const [formState, setFormState] = useState({
    problemTitle: '',
    problemDescription: '',
    referenceSolutionImports: '',
    referenceSolutionPrefix: '',
    referenceSolutionBody: '',
    referenceSolutionSuffix: '',
  });
  const [publicTests, setPublicTests] = useState([]);
  const [privateTests, setPrivateTests] = useState([]);
  const [status, setStatus] = useState(MatchSettingStatus.DRAFT);
  const [loading, setLoading] = useState(!!matchSettingId);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  useEffect(() => {
    setCurrentId(matchSettingId);
  }, [matchSettingId]);

  const loadMatchSetting = useCallback(async () => {
    if (!currentId) return;
    setLoading(true);
    setError(null);
    const result = await getMatchSetting(currentId);
    if (result?.success === false) {
      setError(getApiErrorMessage(result, 'Unable to load match setting.'));
      setLoading(false);
      return;
    }
    const data = result?.data || result;
    if (!data) {
      setError('Match setting not found.');
      setLoading(false);
      return;
    }
    const { imports, prefix, solution, suffix } = splitReferenceSolution(
      data.referenceSolution
    );
    setFormState({
      problemTitle: data.problemTitle || '',
      problemDescription: data.problemDescription || '',
      referenceSolutionImports: imports,
      referenceSolutionPrefix: prefix,
      referenceSolutionBody: solution,
      referenceSolutionSuffix: suffix,
    });
    setPublicTests(mapTestCases(data.publicTests));
    setPrivateTests(mapTestCases(data.privateTests));
    setStatus(data.status || MatchSettingStatus.DRAFT);
    setLoading(false);
  }, [currentId, getMatchSetting]);

  useEffect(() => {
    if (!currentId) {
      setLoading(false);
      return;
    }
    loadMatchSetting();
  }, [currentId, loadMatchSetting]);

  const statusLabel = useMemo(() => getStatusLabel(status), [status]);
  const statusVariant = useMemo(() => getStatusVariant(status), [status]);
  const isEditable = status !== MatchSettingStatus.READY;
  const isNew = !currentId;
  const {
    problemTitle,
    problemDescription,
    referenceSolutionImports,
    referenceSolutionPrefix,
    referenceSolutionBody,
    referenceSolutionSuffix,
  } = formState;

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImportsChange = (event) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      referenceSolutionImports: value,
    }));
  };

  const handlePrefixChange = (event) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      referenceSolutionPrefix: value,
    }));
  };

  const handleSolutionBodyChange = (event) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      referenceSolutionBody: value,
    }));
  };

  const handleSuffixChange = (event) => {
    const { value } = event.target;
    setFormState((prev) => ({
      ...prev,
      referenceSolutionSuffix: value,
    }));
  };

  const handleTestCaseChange = (setter, id, field, value) => {
    setter((prev) =>
      prev.map((testCase) => {
        if (testCase.id !== id) return testCase;
        return { ...testCase, [field]: value };
      })
    );
  };

  const addPublicTestCase = () => {
    setPublicTests((prev) => [
      ...prev,
      { id: createTestCaseId(), input: '', output: '' },
    ]);
  };

  const addPrivateTestCase = () => {
    setPrivateTests((prev) => [
      ...prev,
      { id: createTestCaseId(), input: '', output: '' },
    ]);
  };

  const removePublicTestCase = (id) => {
    setPublicTests((prev) => prev.filter((testCase) => testCase.id !== id));
  };

  const removePrivateTestCase = (id) => {
    setPrivateTests((prev) => prev.filter((testCase) => testCase.id !== id));
  };

  const buildPayload = () => {
    const referenceSolution = assembleReferenceSolution(
      referenceSolutionImports,
      referenceSolutionPrefix,
      referenceSolutionBody,
      referenceSolutionSuffix
    );
    return {
      problemTitle: problemTitle.trim(),
      problemDescription: problemDescription || '',
      referenceSolution,
      publicTests: serializeTestCases(publicTests),
      privateTests: serializeTestCases(privateTests),
    };
  };

  const handleReferenceUpload = (event) => {
    const { files } = event.target;
    const [file] = files || [];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const content = typeof reader.result === 'string' ? reader.result : '';
      const { imports, prefix, solution, suffix } =
        splitReferenceSolution(content);
      setFormState((prev) => ({
        ...prev,
        referenceSolutionImports: imports,
        referenceSolutionPrefix: prefix,
        referenceSolutionBody: solution,
        referenceSolutionSuffix: suffix,
      }));
      setSuccessMessage('Reference solution loaded from file.');
      setError(null);
    };
    reader.readAsText(file);
  };

  const validateTitle = () => {
    if (isBlank(problemTitle)) {
      setError('Match setting name is required.');
      return false;
    }
    return true;
  };

  const validatePublish = (payload) => {
    if (isBlank(payload.problemDescription)) {
      return 'Problem description is required to publish.';
    }
    if (isBlank(payload.referenceSolution)) {
      return 'Reference solution is required to publish.';
    }
    if (!payload.publicTests.length) {
      return 'Add at least one public test case before publishing.';
    }
    if (!payload.privateTests.length) {
      return 'Add at least one private test case before publishing.';
    }
    return null;
  };

  const persistDraft = async (skipNavigation = false) => {
    if (!validateTitle()) return null;
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    const payload = buildPayload();
    let result;
    if (currentId) {
      result = await updateMatchSetting(currentId, payload);
    } else {
      result = await createMatchSetting(payload);
    }
    if (result?.success === false) {
      setError(getApiErrorMessage(result, 'Unable to save match setting.'));
      setSaving(false);
      return null;
    }
    const data = result?.data || result;
    setSaving(false);
    setStatus(data.status || MatchSettingStatus.DRAFT);
    if (data?.id && !currentId) {
      setCurrentId(data.id);
      if (!skipNavigation) {
        router.replace(`/match-settings/${data.id}`);
      }
    }
    return data;
  };

  const handleSaveDraft = async () => {
    const saved = await persistDraft();
    if (saved) {
      setSuccessMessage('Draft saved.');
    }
  };

  const handlePublish = async () => {
    if (!validateTitle()) return;
    const payload = buildPayload();
    const validationError = validatePublish(payload);
    if (validationError) {
      setError(validationError);
      return;
    }
    setPublishing(true);
    setError(null);
    setSuccessMessage(null);
    const saved = await persistDraft(true);
    if (!saved?.id) {
      setPublishing(false);
      return;
    }
    const result = await publishMatchSetting(saved.id);
    if (result?.success === false) {
      setError(getApiErrorMessage(result, 'Unable to publish match setting.'));
      setPublishing(false);
      return;
    }
    const data = result?.data || result;
    setPublishing(false);
    setStatus(data.status || MatchSettingStatus.READY);
    setSuccessMessage('Match setting published.');
    if (data?.id && isNew) {
      router.replace(`/match-settings/${data.id}`);
    }
  };

  const handleUnpublish = async () => {
    if (!currentId) return;
    setUnpublishing(true);
    setError(null);
    setSuccessMessage(null);
    const result = await unpublishMatchSetting(currentId);
    if (result?.success === false) {
      setError(
        getApiErrorMessage(result, 'Unable to unpublish match setting.')
      );
      setUnpublishing(false);
      return;
    }
    const data = result?.data || result;
    setUnpublishing(false);
    setStatus(data.status || MatchSettingStatus.DRAFT);
    setSuccessMessage('Match setting saved as draft.');
  };

  const handleDuplicate = async () => {
    if (!currentId) return;
    setDuplicating(true);
    setError(null);
    setSuccessMessage(null);
    const result = await duplicateMatchSetting(currentId);
    if (result?.success === false) {
      setError(
        getApiErrorMessage(result, 'Unable to duplicate match setting.')
      );
      setDuplicating(false);
      return;
    }
    const data = result?.data || result;
    setDuplicating(false);
    if (data?.id) {
      router.push(`/match-settings/${data.id}`);
    }
  };

  if (!isAuthorized) return null;

  if (loading && currentId) {
    return (
      <div className={styles.container}>
        <Spinner label='Loading match setting...' />
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerRow}>
          <div className={styles.titleGroup}>
            <p className={styles.eyebrow}>Match settings</p>
            <h1 className={styles.title}>
              {isNew ? 'Create match setting' : 'Edit match setting'}
            </h1>
          </div>
          <div className={styles.headerActions}>
            <Button variant='outline' asChild>
              <Link href='/match-settings'>Back to list</Link>
            </Button>
            {currentId ? (
              <Button
                variant='secondary'
                onClick={handleDuplicate}
                disabled={duplicating}
              >
                {duplicating ? 'Duplicating…' : 'Duplicate'}
              </Button>
            ) : null}
          </div>
        </div>
        <div className={styles.metaRow}>
          <Badge variant={statusVariant}>{statusLabel}</Badge>
          {status === MatchSettingStatus.READY ? (
            <span className={styles.statusNote}>
              Unpublish to edit this match setting.
            </span>
          ) : null}
        </div>
      </header>

      <div className={styles.card}>
        <FieldSet>
          <Field orientation='vertical'>
            <FieldLabel htmlFor='problemTitle'>Match setting name</FieldLabel>
            <FieldContent>
              <Input
                id='problemTitle'
                name='problemTitle'
                value={problemTitle}
                onChange={handleFieldChange}
                placeholder='Enter a match setting name'
                disabled={!isEditable}
              />
              <FieldDescription>
                This name appears in the match settings list.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldSet>
      </div>

      <div className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Problem description</h2>
            <p className={styles.sectionDescription}>
              Add the prompt students will see when they start the match.
            </p>
          </div>
          <textarea
            id='problemDescription'
            name='problemDescription'
            className={styles.textarea}
            value={problemDescription}
            onChange={handleFieldChange}
            placeholder='Describe the challenge and any constraints.'
            disabled={!isEditable}
          />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Reference solution</h2>
            <p className={styles.sectionDescription}>
              Split the solution into imports, fixed prefix, solution body, and
              fixed suffix to keep the template consistent.
            </p>
          </div>
          <div className={styles.gridTwo}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor='solutionImports'>
                Imports
              </label>
              <textarea
                id='solutionImports'
                className={styles.textarea}
                value={referenceSolutionImports}
                onChange={handleImportsChange}
                placeholder='#include <bits/stdc++.h>'
                disabled={!isEditable}
              />
              <p className={styles.fieldHint}>
                Use only <code>#include</code> lines in this section.
              </p>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor='solutionPrefix'>
                Fixed prefix
              </label>
              <textarea
                id='solutionPrefix'
                className={styles.textarea}
                value={referenceSolutionPrefix}
                onChange={handlePrefixChange}
                placeholder='e.g. int main() {'
                disabled={!isEditable}
              />
              <p className={styles.fieldHint}>
                This section stays before the editable solution body.
              </p>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor='solutionBody'>
                Solution body
              </label>
              <textarea
                id='solutionBody'
                className={styles.textarea}
                value={referenceSolutionBody}
                onChange={handleSolutionBodyChange}
                placeholder='Write the reference implementation here.'
                disabled={!isEditable}
              />
              <p className={styles.fieldHint}>
                This is where the core solution logic goes.
              </p>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel} htmlFor='solutionSuffix'>
                Fixed suffix
              </label>
              <textarea
                id='solutionSuffix'
                className={styles.textarea}
                value={referenceSolutionSuffix}
                onChange={handleSuffixChange}
                placeholder='e.g. }'
                disabled={!isEditable}
              />
              <p className={styles.fieldHint}>
                This section closes any fixed blocks from the prefix.
              </p>
            </div>
          </div>
          <div className={styles.uploadRow}>
            <label className={styles.uploadLabel} htmlFor='referenceUpload'>
              Upload solution file
            </label>
            <input
              id='referenceUpload'
              type='file'
              accept='.cpp,.c,.txt'
              onChange={handleReferenceUpload}
              disabled={!isEditable}
            />
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Public test cases</h2>
            <p className={styles.sectionDescription}>
              Public tests are visible to students after they run their code.
            </p>
          </div>
          <div className={styles.testList}>
            {publicTests.length === 0 ? (
              <p className={styles.emptyHint}>
                No public tests yet. Add one to get started.
              </p>
            ) : null}
            {publicTests.map((testCase) => {
              const { id, input, output } = testCase;
              const publicInputId = `public-input-${id}`;
              const publicOutputId = `public-output-${id}`;
              return (
                <div key={id} className={styles.testRow}>
                  <div className={styles.fieldGroup}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor={publicInputId}
                    >
                      Input
                    </label>
                    <textarea
                      id={publicInputId}
                      className={styles.textarea}
                      value={input}
                      onChange={(event) => {
                        const { value } = event.target;
                        handleTestCaseChange(
                          setPublicTests,
                          id,
                          'input',
                          value
                        );
                      }}
                      placeholder='e.g. [1,2,3]'
                      disabled={!isEditable}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor={publicOutputId}
                    >
                      Expected output
                    </label>
                    <textarea
                      id={publicOutputId}
                      className={styles.textarea}
                      value={output}
                      onChange={(event) => {
                        const { value } = event.target;
                        handleTestCaseChange(
                          setPublicTests,
                          id,
                          'output',
                          value
                        );
                      }}
                      placeholder='e.g. 6'
                      disabled={!isEditable}
                    />
                  </div>
                  <div className={styles.testActions}>
                    <Button
                      variant='ghost'
                      size='sm'
                      type='button'
                      onClick={() => removePublicTestCase(id)}
                      disabled={!isEditable}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            variant='secondary'
            type='button'
            onClick={addPublicTestCase}
            disabled={!isEditable}
          >
            Add public test
          </Button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Private test cases</h2>
            <p className={styles.sectionDescription}>
              Private tests are used for grading and not shown to students.
            </p>
          </div>
          <div className={styles.testList}>
            {privateTests.length === 0 ? (
              <p className={styles.emptyHint}>
                No private tests yet. Add one to secure grading.
              </p>
            ) : null}
            {privateTests.map((testCase) => {
              const { id, input, output } = testCase;
              const privateInputId = `private-input-${id}`;
              const privateOutputId = `private-output-${id}`;
              return (
                <div key={id} className={styles.testRow}>
                  <div className={styles.fieldGroup}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor={privateInputId}
                    >
                      Input
                    </label>
                    <textarea
                      id={privateInputId}
                      className={styles.textarea}
                      value={input}
                      onChange={(event) => {
                        const { value } = event.target;
                        handleTestCaseChange(
                          setPrivateTests,
                          id,
                          'input',
                          value
                        );
                      }}
                      placeholder='e.g. [2,5]'
                      disabled={!isEditable}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label
                      className={styles.fieldLabel}
                      htmlFor={privateOutputId}
                    >
                      Expected output
                    </label>
                    <textarea
                      id={privateOutputId}
                      className={styles.textarea}
                      value={output}
                      onChange={(event) => {
                        const { value } = event.target;
                        handleTestCaseChange(
                          setPrivateTests,
                          id,
                          'output',
                          value
                        );
                      }}
                      placeholder='e.g. 7'
                      disabled={!isEditable}
                    />
                  </div>
                  <div className={styles.testActions}>
                    <Button
                      variant='ghost'
                      size='sm'
                      type='button'
                      onClick={() => removePrivateTestCase(id)}
                      disabled={!isEditable}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            variant='secondary'
            type='button'
            onClick={addPrivateTestCase}
            disabled={!isEditable}
          >
            Add private test
          </Button>
        </div>
      </div>

      <div className={styles.actionsRow}>
        {error ? <div className={styles.error}>{error}</div> : null}
        {!error && successMessage ? (
          <div className={styles.success}>{successMessage}</div>
        ) : null}
        <div className={styles.actionButtons}>
          {status === MatchSettingStatus.READY ? (
            <Button
              type='button'
              variant='secondary'
              onClick={handleUnpublish}
              disabled={unpublishing}
            >
              {unpublishing ? 'Unpublishing…' : 'Unpublish'}
            </Button>
          ) : null}
          {status !== MatchSettingStatus.READY ? (
            <>
              <Button
                type='button'
                variant='outline'
                onClick={handleSaveDraft}
                disabled={saving || publishing || !isEditable}
              >
                {saving ? 'Saving…' : 'Save draft'}
              </Button>
              <Button
                type='button'
                onClick={handlePublish}
                disabled={publishing || saving || !isEditable}
              >
                {publishing ? 'Publishing…' : 'Publish'}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

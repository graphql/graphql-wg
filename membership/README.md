# GraphQL Specification Membership

All contributors must sign the GraphQL Specification membership agreement ([preview](./GraphQL-Specification_Membership-2021-01-25-PREVIEW.pdf)) prior to participating in specification or code activity. 

There is no cost, and once you've signed the document you will able to open PRs and participate in development discussions in the various GraphQL working groups.

GraphQL uses EasyCLA to ensure that all contributors have signed the documents. While the GraphQL Specification membership agreements are not a CLA, the workflow is the same. If you or your organization haven't signed the documents, simply open a PR and you will be prompted through the process.

Please note that this is different from [membership in the GraphQL Foundation](https://foundation.graphql.org/join). If your organization relies upon GraphQL, please become a member. Membership dues are the single source of essential funding that we rely upon to support the GraphQL ecosystem.

### Who signs the documents?

You can either sign the GraphQL Specification membership documents as an individual, or your company can sign and authorize you as a contributor. 

The individual workflow is for people who can make the membership commitments on their own behalf (e.g., hobbyists, students, sole proprietors, etc). This workflow is fast and easy, but may not be appropriate for people who are doing work-for-hire. The corporate workflow is more complicated, but allows a company to sign one document and then manage all contributors (including pre-approval based upon email domain or GitHub org).

At a high level, the signature process works like this:

1. Open a PR against any [GraphQL repo](https://github.com/graphql) covered by EasyCLA.
1. A bot will check whether your GitHub user is covered by a signed specification membership agreement.
1. If you're covered, you are done and your contribution can be merged.
1. If you're not covered, you'll be prompted through the signature process.

### Initiating the signature process against the test repo

The easiest way to initiate the process is to open a trivial PR against the test repo. Just fork this repo, make a trivial change, open a PR, and follow the steps.

* [EasyCLA test repo](https://github.com/graphql/easycla-test)

Alternately, you can open a PR against any other covered GraphQL repo.

## Sign as an individual

If you are working on your own behalf and can make IP commitments about what you produce, you can sign as an individual contributor. 

1. Open a PR against one of the test repos.
1. When blocked by the bot, follow the prompts and choose *Individual*.
1. Fill in the details and sign the DocuSign form.
1. Wait a little while for the check to re-run.

That's all there is to it.

## Have your company sign for you

If you are doing work for someone else (e.g., it's your job), the company might need to sign for you. The advantage here is that they can authorize other employees with a single signature. If your company has already signed the document but you're still blocked, you may just need to request your username be added to the list of authorized contributors. Either way, you'll have to confirm you work for them.

### If your company hasn't yet signed the agreement

1. Open a PR against one of the covered repos (code-only, or code+spec).
1. When blocked by the bot, follow the prompts and choose *Corporate*.
1. Choose your company from the list. If it's not there, add it.
1. Designate someone with signing authority (generally an officer or attorney, if in doubt ask your manager) to receive the DocuSign. This person is the *CLA Manager*.
1. Follow up with the CLA Manager and ask them to sign the DocuSign form.
1. The CLA Manager can now designate other CLA Managers who are allowed to manage your company's list of authorized contributors.

### When your company has finished signing the agreement

1. Once the agreement is signed, any CLA manager can [log into the EasyCLA site](https://easycla.lfx.linuxfoundation.org/#/) (choose EasyCLA v1) and either:
  * Add your GitHub username individually to the list of authorized contributors, or
  * Authorize any GitHub user with an email matching the corporate domain, or
  * Authorize any user who is a member of your company's GitHub org.
2. Once this is done, you'll probably need to click the *Details* link in the PR and click a button that acknowledges you want to be covered by the company.
3. Wait a little while for the check to re-run.

At this point, your PRs will no longer be blocked by EasyCLA on any GraphQL Foundation repo.

### Best practices

* Ask the CLA Manager to add the corporate email domain to the list of authorized contributors. If your company is very diligent about adding employees to a corporate GitHub organization, this is another good way to do it. Either way, it is much easier than adding contributors individually.

## Getting help

If your company is in the system but you don't know who your CLA manager is, you can email [operations@graphql.org](mailto:operations@graphql.org).

If you run into issues, you can [open a ticket in JIRA](https://jira.linuxfoundation.org/plugins/servlet/theme/portal/4/create/143).
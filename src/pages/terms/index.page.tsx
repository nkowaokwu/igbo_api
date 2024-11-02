/* eslint-disable */
import React from 'react';
import { Box, Heading, Text, UnorderedList, ListItem } from '@chakra-ui/react';
import { APP_URL } from '../../siteConstants';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => (
  <>
    <Box style={{ minHeight: '96vh' }} className="flex flex-col items-center py-12">
      <Box className="w-11/12 lg:w-6/12 flex flex-col justify-start py-3 lg:py-10">
        {/* Terms and Conditions Start */}
        <Box className="privacy-container space-y-4">
          <Heading as="h1">Terms and Conditions</Heading>
          <Heading as="h2">1. About the Website</Heading>
          <UnorderedList>
            <ListItem>
              Welcome to the <a href={APP_URL}>Igbo API</a> (the &#39; <strong>Igbo</strong>&#39;)
              dictionary API. The Website that offers an Igbo-English dictionary API as (the &#39;{' '}
              <strong>Services</strong>
              &#39;).
            </ListItem>
            <ListItem>
              The Website is operated by Nkọwa okwu LLC. Access to and use of the Website, or any of
              its associated Products or Services, is provided by Nkọwa okwu LLC. Please read these
              terms and conditions (the &#39; <strong>Terms</strong>&#39;) carefully. By using,
              browsing, and/or reading the Website, this signifies that you have read, understood,
              and agree to be bound by the Terms. If you do not agree with the Terms, you must cease
              the use of the Website, or any of Services, immediately.
            </ListItem>
            <ListItem>
              (c)Nkọwa okwu LLC. reserves the right to review and change any of the Terms by
              updating this page at its sole discretion. When Nkọwa okwu LLC. updates the Terms, it
              will use reasonable endeavors to provide you with notice of updates to the Terms. Any
              changes to the Terms take immediate effect from the date of their publication. Before
              you continue, we recommend you keep a copy of the Terms for your records.
            </ListItem>
          </UnorderedList>
          <Heading as="h2">2. Acceptance of the Terms</Heading>
          <Text>
            You accept the Terms by remaining on the Website. You may also accept the Terms by
            clicking to accept or agree to the Terms where this option is made available to you by
            Nkọwa okwu LLC. in the user interface. Nkọwa okwu LLC reserves the right to change the
            Terms at any time.
          </Text>
          <Heading as="h2">3. Subscription and Registration to use Nkọwa okwu Services</Heading>
          <UnorderedList>
            <ListItem>
              All users by default have access to all Nkọwa okwu Learning free tiers and no credit
              card information is required (&#39;No <strong>Subscription Fee</strong>&#39;) for this
              tier.
            </ListItem>
            <ListItem>
              In order to access the advanced features of Nkọwa okwu Learning, you must first
              purchase a subscription through the Website (the &#39; <strong>Subscription</strong>
              &#39;) and pay the applicable fee for the selected Subscription (the &#39;{' '}
              <strong>Subscription Fee</strong>&#39;).
            </ListItem>
            <ListItem>
              In purchasing the Subscription, you acknowledge and agree that it is your
              responsibility to ensure that the Subscription you elect to purchase is suitable for
              your use.
            </ListItem>
            <ListItem>
              Once you have purchased the Subscription, you will then be required to register for an
              account through the Website before you can access the Services (the &#39;{' '}
              <strong>Account</strong>&#39;).
            </ListItem>
            <ListItem>
              As part of the registration process, or as part of your continued use of the Services,
              you may be required to provide personal information about yourself (such as
              identification or contact details), including:
            </ListItem>
            <Box pl={8}>
              <ListItem>Email address</ListItem>
              <ListItem>Full name</ListItem>
              <ListItem>Mailing address</ListItem>
              <ListItem>Password</ListItem>
            </Box>
            <ListItem>
              You warrant that any information you give to Nkọwa okwu LLC. in the course of
              completing the registration process will always be accurate, correct and up to date.
            </ListItem>
            <ListItem>
              (f)Once you have completed the registration process, you will be a registered member
              of the Website (&#39; <strong>Member</strong>&#39;) and agree to be bound by the
              Terms. As a Member, you will be granted immediate access to the Services from the time
              you have completed the registration process until the subscription period expires (the
              &#39; <strong>Subscription Period</strong>&#39;). And you will automatically subscribe
              to all newsletters and promotions and you will have the ability to unsubscribe at any
              time.
            </ListItem>
            <ListItem>You may not use the Services and may not accept the Terms if:</ListItem>
            <Box pl={8}>
              <ListItem>
                you are not of legal age to form a binding contract with Nkọwa okwu LLC.; or
              </ListItem>
              <ListItem>
                you are a person barred from receiving the Services under the laws of or other
                countries including the country in which you are resident or from which you use the
                Services.
              </ListItem>
            </Box>
          </UnorderedList>
          <Heading as="h2">4. Your obligations as a Member</Heading>
          <Text>As a Member, you agree to comply with the following:</Text>
          <UnorderedList>
            <ListItem>
              (a)you will use the Services only for purposes that are permitted by:
            </ListItem>
            <Box pl={8}>
              <ListItem>the Terms; and</ListItem>
              <ListItem>
                any applicable law, regulation, or generally accepted practices or guidelines in the
                relevant jurisdictions;
              </ListItem>
            </Box>
            <ListItem>
              you have the sole responsibility for protecting the confidentiality of your password
              and/or email address. Use of your password by any other person may result in the
              immediate cancellation of the Services;
            </ListItem>
            <ListItem>
              any use of your registration information by any other person, or third parties, is
              strictly prohibited. You agree to immediately notify Nkowa Okwu LLC. of any
              unauthorised use of your password or email address or any breach of security of which
              you have become aware;
            </ListItem>
            <ListItem>
              access and use of the Website is limited, non-transferable and allows for the sole use
              of the Website by you for the purposes of Nkọwa okwu LLC. providing the Services;
            </ListItem>
            <ListItem>
              you will not use the Services or the Website in connection with any commercial
              endeavors except those that are specifically endorsed or approved by the management of
              Nkọwa okwu LLC.;
            </ListItem>
            <ListItem>
              you will not use the Services or Website for any illegal and/or unauthorised use which
              includes collecting email addresses of Members by electronic or other means for the
              purpose of sending unsolicited email or unauthorised framing of or linking to the
              Website;
            </ListItem>
            <ListItem>
              you agree that commercial advertisements, affiliate links, and other forms of
              solicitation may be removed from the Website without notice and may result in
              termination of the Services. Appropriate legal action will be taken by Nkọwa okwu LLC.
              for any illegal or unauthorised use of the Website; and
            </ListItem>
            <ListItem>
              you acknowledge and agree that any automated use of the Website or its Services is
              prohibited.
            </ListItem>
          </UnorderedList>
          <Heading as="h2">5. Payment</Heading>
          <UnorderedList>
            <ListItem>
              Where the option is given to you, you may make payment of the Subscription Fee by way
              of:
            </ListItem>
            <Box pl={8}>
              <ListItem>
                Credit Card Payment (&#39; <strong>Credit Card</strong>&#39;)
              </ListItem>
            </Box>
            <ListItem>
              You acknowledge and agree that where a request for the payment of the Subscription Fee
              is returned or denied, for whatever reason, by your financial institution or is unpaid
              by you for any other reason, then you are liable for any costs, including banking fees
              and charges, associated with the Subscription Fee.
            </ListItem>
            <ListItem>
              You agree and acknowledge that Nkọwa okwu LLC. can vary the Subscription Fee at any
              time and that the varied Subscription Fee will come into effect following the
              conclusion of the existing Subscription Period.
            </ListItem>
          </UnorderedList>
          <Heading as="h2">6. Refund Policy</Heading>
          <Text>Payments are non-refundable and there are no refunds or credits for</Text>
          <Text>partially used periods.</Text>
          <Heading as="h2">7. Copyright</Heading>
          <UnorderedList>
            <ListItem>
              The Website, the Services, and all of the related products of Nkowa Okwu LLC. are
              subject to copyright. The material on the Website is protected by copyright under the
              laws and through international treaties. Unless otherwise indicated, all rights
              (including copyright) in the Services and compilation of the Website (including but
              not limited to text, graphics, logos, button icons, video images, audio clips,
              Website, code, scripts, design elements, and interactive features) or the Services are
              owned or controlled for these purposes and are reserved by Nkọwa okwu LLC. or its
              contributors.
            </ListItem>
            <ListItem>
              All trademarks, service marks, and trade names are owned, registered, and/or licensed
              by Nkọwa okwu LLC., who grants to you a worldwide, non-exclusive, royalty-free,
              revocable license whilst you are a Member to:
            </ListItem>
            <Box pl={8}>
              <ListItem>use the Website pursuant to the Terms;</ListItem>
              <ListItem>
                copy and store the Website and the material contained in the Website in your
                device&#39;s cache memory; and
              </ListItem>
              <ListItem>
                print pages from the Website for your own personal and non-commercial use.
              </ListItem>
            </Box>
            <Text>
              Nkọwa okwu LLC. does not grant you any other rights whatsoever in relation to the
              Website or the Services. All other rights are expressly reserved by Nkọwa okwu LLC..
            </Text>
            <ListItem>
              Nkọwa okwu LLC. retains all rights, title, and interest in and to the Website and all
              related Services. Nothing you do on or in relation to the Website will transfer any:
            </ListItem>
            <Box pl={8}>
              <ListItem>
                business name, trading name, domain name, trademark, industrial design, patent,
                registered design or copyright, or
              </ListItem>
              <ListItem>
                a right to use or exploit a business name, trading name, domain name, trademark or
                industrial design, or
              </ListItem>
              <ListItem>
                a thing, system, or process that is the subject of a patent, registered design, or
                copyright (or an adaptation or modification of such a thing, system, or process), to
                you.
              </ListItem>
            </Box>
            <ListItem>
              You may not, without the prior written permission of Nkọwa okwu LLC. and the
              permission of any other relevant rights owners: broadcast, republish, up-load to a
              third party, transmit, post, distribute, show or play in public, adapt or change in
              any way the Services or third-party services for any purpose, unless otherwise
              provided by these Terms. This prohibition does not extend to materials on the Website,
              which are freely available for re-use or are in the public domain.
            </ListItem>
          </UnorderedList>
          <Heading as="h2">8. Privacy</Heading>
          <Text>
            Nkọwa okwu LLC. takes your privacy seriously and any information provided through your
            use of the Website and/or Services are subject to Nkọwa okwu LLC.&#39;s Privacy Policy,
            which is available on the Website.
          </Text>
          <Heading as="h2">9. General Disclaimer</Heading>
          <UnorderedList>
            <ListItem>
              Nothing in the Terms limits or excludes any guarantees, warranties, representations,
              or conditions implied or imposed by law, including the US Consumer Law (or any
              liability under them) which by law may not be limited or excluded.
            </ListItem>
            <ListItem>Subject to this clause, and to the extent permitted by law:</ListItem>
            <Box pl={8}>
              <ListItem>
                all terms, guarantees, warranties, representations or conditions which are not
                expressly stated in the Terms are excluded; and
              </ListItem>
              <ListItem>
                Nkọwa okwu LLC. will not be liable for any special, indirect or consequential loss
                or damage (unless such loss or damage is reasonably foreseeable resulting from our
                failure to meet an applicable Consumer Guarantee), loss of profit or opportunity, or
                damage to goodwill arising out of or in connection with the Services or these Terms
                (including as a result of not being able to use the Services or the late supply of
                the Services), whether at common law, under contract, tort (including negligence),
                in equity, pursuant to statute or otherwise.
              </ListItem>
            </Box>
            <ListItem>
              Use of the Website and the Services is at your own risk. Everything on the Website and
              the Services is provided to you &quot;as is&quot; and &quot;as available&quot; without
              warranty or condition of any kind. None of the affiliates, directors, officers,
              employees, agents, contributors and licensors of Nkọwa okwu LLC. make any express or
              implied representation or warranty about the Services or any products or Services
              (including the products or Services of Nkọwa okwu LLC.) referred to on the Website.
              includes (but is not restricted to) loss or damage you might suffer as a result of any
              of the following:
            </ListItem>
            <Box pl={8}>
              <ListItem>
                failure of performance, error, omission, interruption, deletion, defect, failure to
                correct defects, delay in operation or transmission, computer virus or other harmful
                components, loss of data, communication line failure, unlawful
              </ListItem>
              <Text>
                third party conduct, or theft, destruction, alteration, or unauthorised access to
                records;
              </Text>
              <ListItem>
                the accuracy, suitability, or currency of any information on the Website, the
                Services, or any of its Services related products (including third party material
                and advertisements on the Website);
              </ListItem>
              <Text>
                costs incurred as a result of you using the Website, the Services or any of the
                products of Nkọwa okwu LLC.; and
              </Text>
              <ListItem>
                the Services or operation in respect to links that are provided for your
                convenience.
              </ListItem>
            </Box>
          </UnorderedList>
          <Heading as="h2">10. Education Services</Heading>
          <UnorderedList>
            <ListItem>
              By using our services, you agree that Nkọwa okwu LLC. is not to be held liable for any
              decisions you make based on any of our services or guidance, and any consequences, as
              a result, are your own. Under no circumstances can you hold Nkọwa okwu LLC. liable for
              any actions you take nor can you hold us or any of our employees liable for any loss
              or costs incurred by you as a result of any guidance, advice, coaching, materials, or
              techniques used or provided by Nkọwa okwu LLC.
            </ListItem>
            <ListItem>
              All our information on both the website and in consultations is intended to assist you
              and does not in any way, nor is it intended to substitute professional, financial, or
              legal advice. Results are not guaranteed and Nkọwa okwu LLC. takes no responsibility
              for your actions, choices, or decisions.
            </ListItem>
          </UnorderedList>
          <Heading as="h2">11. Limitation of liability</Heading>
          <UnorderedList>
            <ListItem>
              Nkọwa okwu LLC.&#39;s total liability arising out of or in connection with the
              Services or these Terms, however arising, including under contract, tort (including
              negligence), in equity, under statute or otherwise, will not exceed the resupply of
              the Services to you.
            </ListItem>
            <ListItem>
              You expressly understand and agree that Nkọwa okwu LLC., its affiliates, employees,
              agents, contributors and licensors shall not be liable to you for any direct,
              indirect, incidental, special consequential or exemplary damages which may be incurred
              by you, however, caused and under any theory of liability. This shall include, but is
              not limited to, any loss of profit (whether incurred directly or indirectly), any loss
              of goodwill or business reputation and any other intangible loss.
            </ListItem>
          </UnorderedList>
          <Heading as="h2">12. Termination of Contract</Heading>
          <UnorderedList>
            <ListItem>
              The Terms will continue to apply until terminated by either you or by Nkọwa okwu LLC.
              as set out below.
            </ListItem>
            <ListItem>(b)If you want to terminate the Terms, you may do so by:</ListItem>
            <Box pl={6}>
              <ListItem>
                not renewing the Subscription prior to the end of the Subscription Period.
              </ListItem>
              <Text>And</Text>
              <ListItem>
                closing your accounts for all of the services which you use, where Nkọwa okwu LLC.
                has made this option available to you.
              </ListItem>
            </Box>
            <ListItem>
              (c)Nkọwa okwu LLC. may at any time, terminate the Terms with you if:
            </ListItem>
            <Box pl={8}>
              <ListItem>
                you do not renew the Subscription at the end of the Subscription Period;
              </ListItem>
              <ListItem>
                you have breached any provision of the Terms or intend to breach any provision;
              </ListItem>
              <ListItem>Nkọwa okwu LLC. is required to do so by law;</ListItem>
              <ListItem>
                the provision of the Services to you by Nkọwa okwu LLC. is, in the opinion of Nkọwa
                okwu LLC., no longer commercially viable.
              </ListItem>
            </Box>
            <ListItem>
              Subject to local applicable laws, Nkọwa okwu LLC. reserves the right to discontinue or
              cancel your membership at any time and may suspend or deny, in its sole discretion,
              your access to all or any portion of the Website or the Services without notice if you
              breach any provision of the Terms or any applicable law or if your conduct impacts
              Nkọwa okwu LLC.&#39;s name or reputation or violates the rights of those of another
              party.
            </ListItem>
          </UnorderedList>
          <Heading as="h2">13. Indemnity</Heading>
          <Text>
            You agree to indemnify Nkọwa okwu LLC., its affiliates, employees, agents, contributors,
            third party content providers, and licensors from and against:
          </Text>
          <UnorderedList>
            <ListItem>
              all actions, suits, claims, demands, liabilities, costs, expenses, loss, and damage
              (including legal fees on a full indemnity basis) incurred, suffered, or arising out of
              or in connection with Your Content;
            </ListItem>
            <ListItem>
              any direct or indirect consequences of you accessing, using, or transacting on the
              Website or attempts to do so; and/or
            </ListItem>
            <ListItem>any breach of the Terms.</ListItem>
          </UnorderedList>
          <Heading as="h2">14. Dispute Resolution</Heading>
          <Box pl={6}>
            <Heading as="h3">14.1. Compulsory:</Heading>
            <Text>
              If a dispute arises out of or relates to the Terms, either party may not commence
            </Text>
            <Text>
              any Tribunal or Court proceedings in relation to the dispute, unless the following
              clauses have been complied with (except where urgent interlocutory relief is sought).
            </Text>
            <Heading as="h3">14.2. Notice:</Heading>
            <Text>
              A party to the Terms claiming a dispute (&#39; <strong>Dispute</strong>
              &#39;) has arisen under the Terms, must give written notice to the other party
              detailing the nature of the dispute, the desired outcome, and the action required to
              settle the Dispute.
            </Text>
            <Heading as="h3">14.3. Resolution:</Heading>
            <Text>
              On receipt of that notice (&#39; <strong>Notice</strong>&#39;) by that other party,
              the parties to the Terms (&#39; <strong>Parties</strong>
              &#39;) must:
            </Text>
            <UnorderedList>
              <ListItem>
                Within 28 days of the Notice endeavor in good faith to resolve the Dispute
                expeditiously by negotiation or such other means upon which they may mutually agree;
              </ListItem>
              <ListItem>
                If for any reason whatsoever, 30 days after the date of the Notice, the Dispute has
                not been resolved, the Parties must either agree upon selection of a mediator or
                request that an appropriate mediator be appointed by the President of the primary
                dispute resolution process or his or her nominee;
              </ListItem>
              <ListItem>
                The Parties are equally liable for the fees and reasonable expenses of a mediator
                and the cost of the venue of the mediation and without limiting the foregoing
                undertake to pay any amounts requested by the mediator as a pre-condition to the
                mediation commencing. The Parties must each pay their own costs associated with the
                mediation;
              </ListItem>
              <ListItem>The mediation will be held in.</ListItem>
            </UnorderedList>
            <Heading as="h3">14.4 Confidential:</Heading>
            <Text>
              All communications concerning negotiations made by the Parties arising out of and in
              connection with this dispute resolution clause are confidential and to the extent
              possible, must be treated as &quot;without prejudice&quot; negotiations for the
              purpose of applicable laws of evidence.
            </Text>
            <Heading as="h3">14.5. Termination of Mediation:</Heading>
            <Text>
              If 3 months have elapsed after the start of a mediation of the Dispute and the Dispute
              has not been resolved, either Party may ask the mediator to terminate the mediation
              and the mediator must do so.
            </Text>
          </Box>
          <Heading as="h2">15. Venue and Jurisdiction</Heading>
          <Text>
            The Services offered by Nkọwa okwu LLC. are intended to be viewed globally. In the event
            of any dispute arising out of or in relation to the Website, you agree that the
            exclusive venue for resolving any dispute shall be in the jurisdiction courts.
          </Text>
          <Heading as="h2">16. Governing Law</Heading>
          <Text>
            The Terms are governed by the laws of. Any dispute, controversy, proceeding or claim of
            whatever nature arising out of or in any way relating to the Terms and the rights
            created hereby shall be governed, interpreted, and construed by, under and pursuant to
            the laws of , without reference to conflict of law principles, notwithstanding mandatory
            rules. The validity of this governing law clause is not contested. The Terms shall be
            binding to the benefit of the parties hereto and their successors and assigns.
          </Text>
          <Heading as="h2">17. Independent Legal Advice</Heading>
          <Text>
            Both parties confirm and declare that the provisions of the Terms are fair and
            reasonable and both parties have taken the opportunity to obtain independent legal
            advice and declare the Terms are not against public policy on the grounds of inequality
            or bargaining power or general grounds of restraint of trade.
          </Text>
        </Box>
      </Box>
    </Box>
  </>
);

export default Terms;
